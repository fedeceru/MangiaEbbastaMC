import { Text, TouchableOpacity, Image } from "react-native";
import { styles } from "../../Styles";

export default MenuListItem = ({ menu, handleShowDetails }) => { 
    return (
        <TouchableOpacity style={styles.listItemCard} onPress={() => handleShowDetails(menu)}>
            <Image source={{ uri: "data:image/jpeg;base64," + menu.image }} style={styles.listMenuImage} />
            <Text style={styles.listTitle}>{menu.name}</Text>
            <Text style={styles.listText}>Prezzo: {menu.price}€</Text>
            <Text style={styles.listText}>Consegna in: {menu.deliveryTime} minuti</Text>
            <Text style={styles.listCaption}>Descrizione: {menu.shortDescription}</Text>
        </TouchableOpacity>
    );
};
