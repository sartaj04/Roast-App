import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { TouchableOpacityProps } from "react-native-gesture-handler"
interface CardProps extends React.PropsWithChildren,TouchableOpacityProps {
    cardText: string
}

const Card:React.FC<CardProps> = ({...props}) => {
  return (
    <TouchableOpacity style={styles.cardContainer} activeOpacity={0.8} onPress={props.onPress}>
        <Text style={styles.cardText}>{props.cardText}</Text>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
    cardContainer: {
            flex: 1,
            justifyContent: 'space-around',
            backgroundColor: '#1C1C1E',
            borderRadius: 10,
            margin: 10,
    },
    cardText :{
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'light',
    }
})
export default Card