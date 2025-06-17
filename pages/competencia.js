import { useState, React, useEffect } from 'react';
import Menu from './menu.js';
import { Container, Table, Modal, ModalHeader, ModalBody, Input, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dado from '../dado/generico.js';
import { useRouter } from 'next/router'
import Carregamento from './carregamento.js';
import styles from './index.module.css'
function Competencia() {
    const [lista, setLista] = useState("");
    const [itemModal, setItemModal] = useState("");
    const router = useRouter();
    const [carregando, setCarregando] = useState("")
    useEffect(() => {
        listar()
    }, [])

    const [modal, setModal] = useState(false);

    const toggleModal = () => setModal(!modal);
    function exibirModal(itemRegistro) {
        setItemModal(itemRegistro)
        toggleModal()
    }
    function listar() {
        setCarregando(true)
        Dado.listar("competencia")
            .then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        setLista(response.data.lista)
                    } else {
                        setLista([])
                        console.log("error: " + response.data.descricao)

                    }
                }
            }, (error) => {
                console.log("error: " + error)
            })
            .finally(() => {
                setCarregando(false)
            });
    }


    function paguei(codigo, mes, ano) {
        Dado.paguei(codigo, mes, ano)
            .then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        var listaTemp = []
                        for (var itemTemp of lista) {
                            if ((itemTemp.mes == mes) && (itemTemp.ano == ano)) {
                                var listaSaidaTemp = []
                                for (var itemSaida of itemTemp.saida) {
                                    if (itemSaida._id == codigo) {
                                        if ((itemSaida.paguei == "") || (itemSaida.paguei == undefined))
                                            itemSaida.paguei = false
                                        itemSaida.paguei = !itemSaida.paguei

                                    }
                                    listaSaidaTemp.push(itemSaida)
                                }
                                itemTemp.saida = listaSaidaTemp

                                var listaSaidaRecorrenteTemp = []
                                for (var itemSaidaRecorrente of itemTemp.saidaRecorrente) {
                                    if (itemSaidaRecorrente._id == codigo) {
                                        if ((itemSaidaRecorrente.paguei == "") || (itemSaidaRecorrente.paguei == undefined))
                                            itemSaidaRecorrente.paguei = false
                                        itemSaidaRecorrente.paguei = !itemSaidaRecorrente.paguei
                                    }
                                    listaSaidaRecorrenteTemp.push(itemSaidaRecorrente)
                                }
                                itemTemp.saidaRecorrente = listaSaidaRecorrenteTemp

                                var listaMozaoTemp = []
                                for (var itemMozao of itemTemp.mozao) {
                                    if (itemMozao._id == codigo) {
                                        if ((itemMozao.paguei == "") || (itemMozao.paguei == undefined))
                                            itemMozao.paguei = false
                                        itemMozao.paguei = !itemSaida.paguei
                                    }
                                    listaMozaoTemp.push(itemMozao)
                                }
                                itemTemp.saidaMozao = listaMozaoTemp
                                setItemModal(itemTemp)
                            }
                            listaTemp.push(itemTemp)
                        }
                        setLista(listaTemp)
                    } else {
                        console.log("error: " + response.data.descricao)
                    }
                }
            }, (error) => {
                console.log("error: " + error)
            })
    }
    function confirmei(codigo, mes, ano) {
        Dado.confirmei(codigo, mes, ano)
            .then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        var listaTemp = []
                        for (var itemTemp of lista) {
                            if ((itemTemp.mes == mes) && (itemTemp.ano == ano)) {
                                var listaSaidaTemp = []
                                for (var itemSaida of itemTemp.saida) {
                                    if (itemSaida._id == codigo) {
                                        if ((itemSaida.confirmei == "") || (itemSaida.confirmei == undefined))
                                            itemSaida.confirmei = false
                                        itemSaida.confirmei = !itemSaida.confirmei

                                    }
                                    listaSaidaTemp.push(itemSaida)
                                }
                                itemTemp.saida = listaSaidaTemp

                                var listaSaidaRecorrenteTemp = []
                                for (var itemSaidaRecorrente of itemTemp.saidaRecorrente) {
                                    if (itemSaidaRecorrente._id == codigo) {
                                        if ((itemSaidaRecorrente.confirmei == "") || (itemSaidaRecorrente.confirmei == undefined))
                                            itemSaidaRecorrente.confirmei = false
                                        itemSaidaRecorrente.confirmei = !itemSaidaRecorrente.confirmei
                                    }
                                    listaSaidaRecorrenteTemp.push(itemSaidaRecorrente)
                                }
                                itemTemp.saidaRecorrente = listaSaidaRecorrenteTemp

                                var listaMozaoTemp = []
                                for (var itemMozao of itemTemp.mozao) {
                                    if (itemMozao._id == codigo) {
                                        if ((itemMozao.confirmei == "") || (itemMozao.confirmei == undefined))
                                            itemMozao.confirmei = false
                                        itemMozao.confirmei = !itemSaida.confirmei
                                    }
                                    listaMozaoTemp.push(itemMozao)
                                }
                                itemTemp.saidaMozao = listaMozaoTemp
                                setItemModal(itemTemp)
                            }
                            listaTemp.push(itemTemp)

                        }
                        setLista(listaTemp)
                    } else {
                        console.log("error: " + response.data.descricao)
                    }
                }
            }, (error) => {
                console.log("error: " + error)
            })
    }

    return (
        <Container>
            <Menu descricao="Competencias" />
            <Table>
                <thead>
                    <tr>
                        <th>
                            Mês
                        </th>
                        <th>
                            Ano
                        </th>
                        <th>
                            Entradas
                        </th>
                        <th>
                            Saídas
                        </th>
                        <th>
                            Saldo
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {lista && lista.map((item) => (
                        <tr onClick={() => exibirModal(item)}>
                            <td>
                                {item.mes}
                            </td>
                            <td>
                                {item.ano}
                            </td>
                            <td>
                                {item.totalEntrada}
                            </td>
                            <td>
                                {item.totalSaida}
                            </td>
                            <td>
                                {item.saldo}
                            </td>

                        </tr>

                    ))}
                </tbody>
            </Table>

            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>{itemModal.mes}/{itemModal.ano}</ModalHeader>
                <ModalBody>

                    <Table>
                        {itemModal.entrada && itemModal.entrada.length > 0 &&
                            <tr>
                                <th>Entradas:</th>
                                <th>{itemModal.totalEntrada}</th>
                            </tr>
                        }
                        {itemModal.entrada && itemModal.entrada.map((itemEntrada) => (
                            <tr>
                                <td>{itemEntrada.descricao}</td> <td>R${itemEntrada.valor}</td>
                                <br />
                            </tr>
                        ))}

                        <br />
                        {itemModal.mozao && itemModal.mozao.length > 0 &&
                            <tr>

                                <th>Mozão:</th>

                                <th>{itemModal.totalMozao}</th>

                            </tr>
                        }


                        {itemModal.mozao && itemModal.mozao.map((itemSaidaMozao) => (
                            <tr>
                                <td>{itemSaidaMozao.descricao}</td><td>R${itemSaidaMozao.valor}</td>
                                <br />
                            </tr>
                        ))}
                        <br />
                        {itemModal.saida && itemModal.saida.length > 0 &&
                            <tr>

                                <th>
                                    Saídas:
                                </th>

                                <th>
                                    {itemModal.totalSomenteNaoRecorrente}
                                </th>

                                <th>
                                    Paguei
                                </th>
                                <th>
                                    Confirmei
                                </th>
                            </tr>
                        }

                        {itemModal.saida && itemModal.saida.map((itemSaida) => (
                            <tr>
                                <td>{itemSaida.descricao}</td><td>R${itemSaida.valor}</td>
                                <td><div onClick={() => paguei(itemSaida._id, itemModal.mes, itemModal.ano)} >{itemSaida.paguei && <div className={styles.sim}>Sim</div>}{!itemSaida.paguei && <div className={styles.nao}>Não</div>}</div></td>
                                <td><div onClick={() => confirmei(itemSaida._id, itemModal.mes, itemModal.ano)} >{itemSaida.confirmei && <div className={styles.sim}>Sim</div>}{!itemSaida.confirmei && <div className={styles.nao}>Não</div>}</div></td>

                                <br />
                            </tr>
                        ))}

                        <br />
                        {itemModal.saidaRecorrente && itemModal.saidaRecorrente.length > 0 &&
                            <tr>

                                <th>
                                    Saídas Recorrentes:
                                </th>

                                <th>
                                    {itemModal.totalSomenteRecorrente}
                                </th>



                                <th>
                                    Paguei
                                </th>

                                <th>
                                    Confirmei
                                </th>

                            </tr>
                        }

                        {itemModal.saidaRecorrente && itemModal.saidaRecorrente.map((itemSaidaRecorrente) => (
                            <tr>
                                <td>{itemSaidaRecorrente.descricao}</td><td>R${itemSaidaRecorrente.valor}</td>
                                <td><div onClick={() => paguei(itemSaidaRecorrente._id, itemModal.mes, itemModal.ano)} >{itemSaidaRecorrente.paguei && <div className={styles.sim}>Sim</div>}{!itemSaidaRecorrente.paguei && <div className={styles.nao}>Não</div>}</div></td>
                                <td><div onClick={() => confirmei(itemSaidaRecorrente._id, itemModal.mes, itemModal.ano)} >{itemSaidaRecorrente.confirmei && <div className={styles.sim}>Sim</div>}{!itemSaidaRecorrente.confirmei && <div className={styles.nao}>Não</div>}</div></td>

                                <br />
                            </tr>
                        ))}

                        <br />
                    </Table>
                    <br />
                </ModalBody>
            </Modal>
            {carregando &&
                <Carregamento />
            }
        </Container>
    );


}


function Pagina() {
    return <Competencia />
}


export default Pagina;