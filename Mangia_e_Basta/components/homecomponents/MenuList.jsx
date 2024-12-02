import { View, FlatList } from "react-native";
import { styles } from "../../Styles";
import MenuListItem from "./MenuListItem";

export default MenuList = ({ menuList, handleShowDetails }) => {
    return (
        <FlatList
            style={styles.list}
            data={menuList}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
                <MenuListItem
                    menu={item}
                    handleShowDetails={handleShowDetails}
                />
            )}
            keyExtractor={(_, index) => index.toString()}
        />
    );
};
