import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import MenuList from './MenuList';
import { useIsFocused } from '@react-navigation/native';
import { styles } from '../../Styles';
import AppViewModel from '../../viewmodel/AppViewModel';
import LoadingScreen from '../LoadingScreen';

const HomeScreen = ({ navigation }) => {
    const [currentPosition, setCurrentPosition] = useState(null); 
    const [menuList, setMenuList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            const fetchMenuList = async () => {
                try {
                    console.log("getting current position...");
                    const location = await AppViewModel.getCurrentPosition();
                    setCurrentPosition(location);
                    if (location) {
                        console.log("fetching menu list...");
                        const menuData = await AppViewModel.fetchMenuList();
                        console.log("fetching menu images...");
                        let updatedMenuList = [];
                        for (const menu of menuData) {
                            try {
                                const image = await AppViewModel.fetchMenuImage(menu);
                                updatedMenuList.push({ ...menu, image: image });
                            } catch (error) {
                                console.log(error);
                            }
                        }
                        setMenuList(updatedMenuList);
                        setIsLoading(false);
                    } 
                } catch (error) {
                    console.log(error);
                }
            }

            fetchMenuList();
        }
    }, [isFocused]);

    const handleShowDetails = (menu) => {
        navigation.navigate('MenuDetails', { menu: menu }); 
    }

    if (isLoading) {
        return (
           <LoadingScreen /> 
        );
    }

    return (
        <SafeAreaView style={styles.homeContainer}>
            <MenuList
                menuList={menuList}
                handleShowDetails={handleShowDetails}
            />
        </SafeAreaView>
    );
};

export default HomeScreen;