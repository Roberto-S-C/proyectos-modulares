import { StyleSheet, View } from "react-native";

interface Question {
    id: number,
    question: string
}

export default function ModuleQuestionListItem({ id, question }: Question) {
    return(
        <View style={styles.container}>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {

    }
});