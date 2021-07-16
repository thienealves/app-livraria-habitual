import React, { useEffect, useState } from 'react';

import {
  StyleSheet, Text, View, ActivityIndicator, FlatList, 
  Image, Button 
} from 'react-native';

import { obterDadosDoCliente } from '../../services/api-usuario';
import { obterCarrinhoCompras, removerItemDoPedido } from '../../services/api-pedido';

import { getData, storeData } from '../../storage';

export default function ItensCarrinho({ navigation }) {
  const [carrinhoCompras, setCarrinhoCompras] = useState({});

  useEffect(() => {
    async function prepararDados() {
      const id = await getData('idUsuario');

      obterDadosDoCliente(id)
        .then((resposta) => {
          obterCarrinhoCompras(resposta.data.pedidoAtivo)
            .then((resposta) => {
              setCarrinhoCompras(resposta.data);
            })
            .catch((erro) => {
              alert("Erro ao listar carrinho de compras! Verifique o console.");
              console.log(erro);
            });
        })
        .catch((erro) => {
          alert("Erro ao listar dados do usuário! Verifique o console.");
          console.log(erro);
        });
    }

    prepararDados();
  }, [])

  function handleExcluirItem(id) {
    removerItemDoPedido(id)
      .then((resposta) => {
        console.log(resposta.data);
      })
      .catch((erro) => {
        alert("Erro ao excluir item! Favor, atualize o app.");
        console.log("Erro ao listar produtos: " + erro);
      });
  }

  function handleEditarItem(itemCarrinho) {
    storeData('itemCarrinho', itemCarrinho);
    storeData('editar', {editar: true});
    storeData('produtoEmFoco', itemCarrinho.produto);

    navigation.navigate('DetalhesDoPedido');
  }

  return (
    <>
      { Object.keys(carrinhoCompras).length !== 0 ?
        <View style={styles.container}>
          
          { carrinhoCompras.produtosDoPedido.length !== 0 ?
            <FlatList
              data={carrinhoCompras.produtosDoPedido}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Image style={styles.tinyLogo}
                    source={{ uri: item.produto.url }} />
                  <View style={{ alignItems: 'center' }}>
                    <Text>{item.produto.nome}</Text>
                    <Text>{`quantidade: ${item.quantidadeProdutos}`}</Text>
                    <View style={styles.containerButton}>
                      <Button title="Editar" onPress={() => handleEditarItem(item)} />
                      <Button title="Remover" onPress={() => handleExcluirItem(item.id)} />
                    </View>
                  </View>
                </View>
              )} />
          :
            <Text>Nenhum produto no carrinho</Text>
          }
        </View>
      :
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#464646" />
        </View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemContainer: {
    marginVertical: 30,
    marginHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },

  tinyLogo: {
    width: 100,
    height: 130,
    marginRight: 10
  },

  containerButton: {
    width: 150,
    justifyContent: 'space-between'
  },
});