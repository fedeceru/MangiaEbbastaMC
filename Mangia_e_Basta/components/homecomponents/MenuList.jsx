import { FlatList, StyleSheet } from "react-native";
import { styles } from "../../Styles";
import MenuListItem from "./MenuListItem";

export default MenuList = ({ menuList, handleShowDetails }) => {
    return (
        <FlatList
            style={localStyles.list}
            data={menuList}
            renderItem={({ item }) => (
                <MenuListItem
                    menu={item}
                    handleShowDetails={handleShowDetails}
                />
            )}
            keyExtractor={(item) => item.mid.toString()}
            contentContainerStyle={{ padding: 16 }}
        />
    );
};

const localStyles = StyleSheet.create({
    list: {
        flex: 1,
    },
});


