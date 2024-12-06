import { View, Text } from "react-native";


const DeliveryStatusScreen = ({ route, navigation }) => {
    const { lastOid, orderStatus } = route.params;

    
    /*
    if (orderStatus === 'ON_DELIVERY') {
        return (

        );
    }

    if (lastOid && orderStatus === 'COMPLETED') {
        return (

        );
    }

    return (
        <View>
            <Text>Non hai ancora fatto alcun ordine</Text>
        </View>
    )*/
}

export default DeliveryStatusScreen;