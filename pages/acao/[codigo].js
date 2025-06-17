import { useState, React, useEffect } from 'react';
import Menu from '../menu.js';
import { Container, Label, Input, Button, Table, Form, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dado from '../../dado/generico.js'
import { useRouter } from 'next/router'
import Host from '../../dado/host.js';
import Carregamento from '../carregamento.js';
import styles from './[codigo].module.css'

function Acao() {
    const [item, setItem] = useState("");
    const [listaCompra, setListaCompra] = useState("");
    const router = useRouter()
    const [carregando, setCarregando] = useState("")
    const [itemModal, setItemModal] = useState("");
    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);

    const [textoModal, setTextoModal] = useState("")

    const [modalInformacao, setModalInformacao] = useState(false);

    const toggleModalInformacao = () => setModalInformacao(!modalInformacao);

    const [modalAdicionar, setModalAdicionar] = useState(false);

    const toggleModalAdicionar = () => setModalAdicionar(!modalAdicionar);
    useEffect(() => {
        if ((router.query.codigo != "") && (router.query.codigo != undefined)) {
            if (router.query.codigo == "incluir") {
                setItem({compra: [] })
                setListaCompra([])
            } else {
                listar(router.query.codigo)
            }
        }
    }, [router.query.codigo])
    function listar(pCodigo) {
        setCarregando(true)
        Dado.item(pCodigo, "acao")
            .then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        if ((response.data.item.compra == "") || (response.data.item.compra == undefined)) {
                            response.data.item.compra = []
                            setListaCompra([])
                        } else {
                            setListaCompra(response.data.item.compra)
                        }
                        setItem(response.data.item)
                        document.getElementById("descricao").value = response.data.item.descricao;
                    } else {
                        setItem({})
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

    function mudarDescricao(event) {
        var itemTemp = item
        itemTemp.descricao = event.target.value
        setItem(itemTemp);

    }

    function adicionar() {
        var dia = document.getElementById("dia").value
        var mes = document.getElementById("mes").value
        var ano = document.getElementById("ano").value
        var valor = document.getElementById("valor").value
        var quantidade = document.getElementById("quantidade").value
        if ((dia == "") || (dia == undefined) ||(mes == "") || (mes == undefined) || (ano == "") || (ano == undefined) || (valor == "") || (valor == undefined)) {
            setTextoModal("Preencha todos os Campos obrigatórios!")
            toggleModalInformacao()
        } else {
            var dia = parseInt(dia)
            var mes = parseInt(mes)
            var ano = parseInt(ano)
            var quantidade = parseInt(quantidade)
            var valor = parseFloat(valor)
            var possuiCompra = false
            var listaCompraTemp = []
            for (var itemCompraTemp of item.compra) {
                //if ((itemCompraTemp.mes == mes) && (itemCompraTemp.ano == ano)) {
                 //   possuiCompra = true
                //} else {
                    listaCompraTemp.push(itemCompraTemp)
                //}
            }
            var itemTemp = JSON.parse(JSON.stringify(item))
            listaCompraTemp.push({dia:dia, mes: mes, ano: ano, valor: valor ,quantidade:quantidade})
            listaCompraTemp = listaCompraTemp.sort((item1, item2) => item1.dia - item2.dia)
            listaCompraTemp = listaCompraTemp.sort((item1, item2) => item1.mes - item2.mes)
            listaCompraTemp = listaCompraTemp.sort((item1, item2) => item1.ano - item2.ano)
            itemTemp.compra = listaCompraTemp
            //if (possuiCompra) {
            //    setTextoModal("Compra " + mes + "/" + ano + " já inclusa, deseja atualizá-la?")
            //    setItemModal(itemTemp)
            //    toggleModalAdicionar()
            //} else {
                setItem(itemTemp)
                setListaCompra(listaCompraTemp)
                setTextoModal(dia+"/"+mes + "/" + ano + " Adicionado com sucesso")
                toggleModalInformacao()
            //}
        }
    }
    function adicionarSemCritica(pItem) {
        setItem(pItem)
        setListaCompra(pItem.compra)
        toggleModalAdicionar()

    }
    function salvar() {
        if (possuiErroObrigatorio()) {
            console.log(item)
            setTextoModal("Preencha todos os Campos obrigatórios!")
            toggleModalInformacao()
        } else {
            if (!item.recorrente) {
                item.mes = ""
                item.ano = ""
            }
            Dado.salvar(item, "acao").then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        router.push(Host.url() + "/acao")
                    } else {
                        console.log("error: " + response.data.descricao)
                    }
                }
            }, (error) => {
                console.log("error: " + error)
            })
        }
    }
    function possuiErroObrigatorio() {
        if (item.descricao == "" || item.descricao == undefined) {
            return true;
        }

    }

    function deletarToggle(pItem) {
        setItemModal(pItem)
        setTextoModal("Deseja excluir a competência: " + pItem.mes + "/" + pItem.ano + "?")
        toggleModal()
    }

    function deletar(pItem) {
        var itemTemp = item
        var listaCompraTemp = []
        for (var itemCompraTemp of listaCompra) {
            if ((itemCompraTemp.dia != pItem.dia) ||(itemCompraTemp.mes != pItem.mes) || (itemCompraTemp.ano != pItem.ano)) {
                listaCompraTemp.push(itemCompraTemp)
            }
        }
        itemTemp.compra = listaCompraTemp
        setItem(itemTemp)
        setListaCompra(listaCompraTemp)
        toggleModal()

    }
    function preencherCamposEdicao(pItem) {
        document.getElementById("valor").value = pItem.valor;
        document.getElementById("mes").value = pItem.mes;
        document.getElementById("ano").value = pItem.ano;
    }
    return (
        <Container>
            <Menu descricao="Saídas" />
            <Form>
            
                <Row>
                    <Col md={10}>
                        <FormGroup>
                            <Label for="descricao">Descricao</Label>
                            <Input type="text" id="descricao" onChange={mudarDescricao} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Row>
                    </Row>
                    <Col md={2}>
                        <FormGroup>
                            <Label for="valor">Valor</Label>
                            <Input type="text" id="valor"/>
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup>
                            <Label for="dia">Dia</Label>
                            <Input type="number" id="dia" />
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup>
                            <Label for="mes">Mês</Label>
                            <Input type="number" id="mes" />
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup>
                            <Label for="ano">Ano</Label>
                            <Input type="number" id="ano" />
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup>
                            <Label for="quantidade">Quantidade</Label>
                            <Input type="number" id="quantidade" />
                        </FormGroup>
                    </Col>
                    <Col md={5}>
                        <FormGroup>
                            <Button color="danger" onClick={adicionar}>Adicionar</Button>
                        </FormGroup>
                    </Col>
                </Row>
                <Table>

                    <thead>
                        <tr>
                            <th>
                                Data
                            </th>
                            <th>
                                Valor
                            </th>
                            <th>
                                Quantidade
                            </th>
                            <th>
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaCompra && listaCompra.map((item) => (
                            <tr onClick={() => preencherCamposEdicao(item)}>
                                <td>
                                    {item.data}
                                </td>
                                <td>
                                    {item.valor}
                                </td>
                                <td>
                                    {item.quantidade}
                                </td>
                                <td>
                                    {item.total}
                                </td>
                                <td>
                                    <img src='/x.png' width="20px" onClick={() => deletarToggle(item)} />

                                </td>
                            </tr>

                        ))}
                    </tbody>
                </Table>


                <Button color="danger" onClick={salvar}>Salvar</Button>
            </Form>
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Confirmação</ModalHeader>
                <ModalBody>
                    {textoModal}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={() => deletar(itemModal)}>
                        OK
                    </Button>{' '}
                    <Button color="secondary" onClick={toggleModal}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={modalInformacao} toggle={toggleModalInformacao}>
                <ModalHeader toggle={toggleModalInformacao}>Informação</ModalHeader>
                <ModalBody>
                    {textoModal}
                </ModalBody>
            </Modal>
            {
                carregando &&
                <Carregamento />
            }

            <           Modal isOpen={modalAdicionar} toggle={toggleModalAdicionar}>
                <ModalHeader toggle={toggleModalAdicionar}>Confirmação</ModalHeader>
                <ModalBody>
                    {textoModal}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={() => adicionarSemCritica(itemModal)}>
                        OK
                    </Button>{' '}
                    <Button color="secondary" onClick={toggleModalAdicionar}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>
        </Container >
    );
}

function Pagina() {

    return <Acao />
}
export default Pagina;