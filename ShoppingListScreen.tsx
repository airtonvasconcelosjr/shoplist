import React, { useState, useEffect } from 'react';
import { View, StatusBar, Text, StyleSheet, TextInput, Button, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';


interface Item {
  id: string;
  category: string;
  checked: boolean;
}

interface ItemCategories {
  [key: string]: string[];
}

const itemCategories: ItemCategories = {
  legumes: ['Beterraba', 'Cenoura', 'Cebola', 'Tomate'],
  limpeza: ['Kiboa', 'Detergente', 'Bucha'],
  banheiro: ['Sabonete', 'Pasta de dente', 'Fio dental', 'Papel higiênico', 'Shampoo'],
  proteína: ['Frango', 'Carne', 'Linguiça', 'Ovo'],
  comida: ['Arroz', 'Feijão', 'Café', 'Açucar', 'Filtro'],
  tempero: ['Alho', 'Shoyu', 'Pimenta preta', 'Lemmon Pepper', 'Açafrão']
  // Adicione mais categorias e itens conforme necessário
};
const [loading, setLoading] = useState(true);

export default function ShoppingListScreen() {
  const [category, setCategory] = useState<string>('');
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    loadItems(); // Carregar os itens salvos ao abrir o aplicativo
  }, []);

  const handleAddItem = () => {
    if (category.trim() !== '') {
      const newItem: Item = {
        id: Date.now().toString(),
        category: category.trim(),
        checked: false,
      };

      setItems(prevItems => [...prevItems, newItem]);
      setCategory('');

      saveItems([...items, newItem]); // Salvar os itens atualizados no AsyncStorage
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));

    const updatedItems = items.filter(item => item.id !== itemId);
    saveItems(updatedItems); // Salvar os itens atualizados no AsyncStorage
  };

  const handleCheckItem = (itemId: string) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          return { ...item, checked: !item.checked };
        }
        return item;
      })
    );

    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    saveItems(updatedItems); // Salvar os itens atualizados no AsyncStorage
  };

  const saveItems = async (items: Item[]) => {
    try {
      await AsyncStorage.setItem('shoppingList', JSON.stringify(items));
    } catch (error) {
      // Tratar erros ao salvar os itens
      console.log('Erro ao salvar os itens:', error);
    }
  };

  const loadItems = async () => {
    setLoading(true); // Iniciar animação de carregamento
  
    try {
      const savedItems = await AsyncStorage.getItem('shoppingList');
      if (savedItems !== null) {
        setItems(JSON.parse(savedItems));
      }
    } catch (error) {
      // Tratar erros ao carregar os itens
      console.log('Erro ao carregar os itens:', error);
    }
  
    setLoading(false); // Finalizar animação de carregamento
  };
  

  const handleCheckAllItems = () => {
    setItems(prevItems =>
      prevItems.map(item => ({ ...item, checked: true }))
    );

    const updatedItems = items.map(item => ({ ...item, checked: true }));
    saveItems(updatedItems); // Salvar os itens atualizados no AsyncStorage
  };

  const handleRemoveAllItems = () => {
    setItems([]);

    saveItems([]); // Salvar a lista vazia no AsyncStorage
  };

  const renderItem = ({ item }: { item: Item }) => {
    let cardStyle = {};

    let categoryFound = false;
    for (const category in itemCategories) {
      if (itemCategories[category].includes(item.category)) {
        switch (category) {
          case 'legumes':
            cardStyle = { backgroundColor: 'green' };
            break;
          case 'limpeza':
            cardStyle = { backgroundColor: 'blue' };
            break;
          case 'banheiro':
            cardStyle = { backgroundColor: 'yellow' };
            break;
          case 'proteína':
            cardStyle = { backgroundColor: 'red' };
            break;
          case 'comida':
            cardStyle = { backgroundColor: 'pink' };
            break;
          case 'tempero':
            cardStyle = { backgroundColor: 'brown' };
            break;
          default:
            cardStyle = { backgroundColor: 'gray' };
            break;
        }
        categoryFound = true;
        break;
      }
    }

    if (!categoryFound) {
      cardStyle = { backgroundColor: 'gray' };
    }

    return (
      <View style={[styles.card, cardStyle]}>
        <TouchableOpacity onPress={() => handleCheckItem(item.id)}>
          {item.checked ? <Text style={styles.checkbox_true}>✓</Text> : <Text style={styles.checkbox}>*</Text>}
        </TouchableOpacity>
        <Text style={styles.cardText}>{item.category}</Text>
        <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
          <Text style={styles.cardButton}>-</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Animatable.View style={styles.container} animation={loading ? 'fadeIn' : undefined} duration={500}>
      <SafeAreaView style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Categoria"
            value={category}
            onChangeText={text => setCategory(text)}
          />
          <Button title="Add" onPress={handleAddItem} />
          <View style={styles.systemIcons}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" />
            {/* Adicione os ícones do sistema aqui */}
          </View>
        </View>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={handleCheckAllItems}>
            <Text style={styles.footerButtonText}>Marcar Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={handleRemoveAllItems}>
            <Text style={styles.footerButtonText}>Excluir Todos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  list: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    height: 50, // Defina uma altura fixa para os cards
  },
  cardText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 8,
  },
  cardButton: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  checkbox: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  },
  checkbox_true: {
    fontSize: 24,
    color: 'green',
    fontWeight: 'bold',
    marginRight: 8,
  },
  systemIcons: {
    // Estilos para os ícones do sistema
    backgroundColor: 'yellow', // Defina a cor desejada
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  footerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'gray',
  },
  footerButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});
