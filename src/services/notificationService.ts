import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import apiClient from "../api/client";
import { registerPushToken, unregisterPushToken } from "./accountService";
import { CreateNotification } from "../types/notification.type";

// Matches "defaultChannel" in the expo-notifications plugin config (app.json)
const DEFAULT_CHANNEL_ID = "default";

// Sign-out waits at most this long for the backend before signing out anyway
const UNREGISTER_TIMEOUT_MS = 3000;

// The token registered for the signed-in account on this device, removed again on sign-out
let registeredPushToken: string | null = null;

// Without a handler, notifications that arrive while the app is open aren't shown
export const configureNotificationHandler = () => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });
}

/**
 * Asks for notification permission and returns this device's Expo push token, or null when it
 * can't get one (emulator/simulator or permission denied).
 */
export const getExpoPushToken = async (): Promise<string | null> => {
    if (!Device.isDevice) return null;

    // Android 13+ only shows the permission prompt once a channel exists
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL_ID, {
            name: "Notificaciones",
            importance: Notifications.AndroidImportance.MAX,
        });
    }

    let { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
        ({ status } = await Notifications.requestPermissionsAsync());
    }
    if (status !== "granted") return null;

    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    return data;
}

// Registers this device's token for the signed-in account (every launch and sign-in)
export const registerDevicePushToken = async () => {
    const token = await getExpoPushToken();
    if (!token) return;
    await registerPushToken(token);
    registeredPushToken = token;
}

/**
 * Called on sign-out, before the JWT is discarded, so the device stops receiving the account's
 * notifications. Never blocks the sign-out for long: if it fails (offline...), the next account
 * signing in on this device takes the token over anyway.
 */
export const unregisterDevicePushToken = async () => {
    const token = registeredPushToken;
    if (!token) return;
    registeredPushToken = null;

    try {
        await Promise.race([
            unregisterPushToken(token),
            new Promise(resolve => setTimeout(resolve, UNREGISTER_TIMEOUT_MS))
        ]);
    }
    catch (e) { }
}

// ADMIN: every notification sent by any ADMIN, newest first
export const getSentNotifications = () => apiClient.get(`/notifications`);

// The signed-in account's received notifications, newest first
export const getReceivedNotifications = () => apiClient.get(`/notifications/received`);

// ADMIN: saves the notification and pushes it to every receiver's devices
export const sendNotification = (notification: CreateNotification) => apiClient.post(`/notifications`, notification);
