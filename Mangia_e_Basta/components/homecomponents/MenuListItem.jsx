import { Text, View, TouchableOpacity, Image } from "react-native";
import { styles } from "../../Styles";

export default MenuListItem = ({ menu, handleShowDetails }) => { 
    return (
        <View >
            <Text style={styles.title}>{menu.name}</Text>
            <Image source={{ uri: "data:image/jpeg;base64," + menu.image }} style={styles.image} />
            <Text style={styles.text}>{menu.price}</Text>
            <Text style={styles.text}>{menu.shortDescription}</Text>
            <Text style={styles.text}>{menu.deliveryTime}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => handleShowDetails(menu)}>
                    <Text style={styles.buttonText}>Dettagli</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
