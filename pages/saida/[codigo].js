import { useState, React, useEffect } from 'react';
import Menu from '../menu.js';
import { Container, Label, Input, Button, Table, Form, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dado from '../../dado/generico.js'
import { useRouter } from 'next/router'
import Host from '../../dado/host.js';
import Carregamento from '../carregamento.js';
import styles from './[codigo].module.css'

function Saida() {
    const [item, setItem] = useState("");
    const [listaCompetencia, setListaCompetencia] = useState("");
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
                setItem({ recorrente: false, mozao: false, competencia: [] })
                setListaCompetencia([])
            } else {
                listar(router.query.codigo)
            }
        }
    }, [router.query.codigo])
    function listar(pCodigo) {
        setCarregando(true)
        Dado.item(pCodigo, "saida")
            .then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        if ((response.data.item.competencia == "") || (response.data.item.competencia == undefined)) {
                            response.data.item.competencia = []
                            setListaCompetencia([])
                        } else {
                            setListaCompetencia(response.data.item.competencia)
                        }
                        setItem(response.data.item)
                        document.getElementById("descricao").value = response.data.item.descricao;
                        document.getElementById("valor").value = response.data.item.valor;
                        document.getElementById("recorrente").checked = response.data.item.recorrente;
                        document.getElementById("mozao").checked = response.data.item.mozao;
                        document.getElementById("mes").value = response.data.item.mes;
                        document.getElementById("ano").value = response.data.item.ano;
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
    function mudarValor(event) {
        var itemTemp = item
        itemTemp.valor = event.target.value
        setItem(itemTemp);

    }
    function mudarRecorrente(event) {
        var itemTemp = item
        itemTemp.recorrente = event.target.checked
        setItem(itemTemp);

    }
    function mudarMozao(event) {
        var itemTemp = item
        itemTemp.mozao = event.target.checked
        setItem(itemTemp);

    }
    function mudarMes(event) {
        var itemTemp = item
        itemTemp.mes = event.target.value
        setItem(itemTemp);

    }
    function mudarAno(event) {
        var itemTemp = item
        itemTemp.ano = event.target.value
        setItem(itemTemp);

    }
    function adicionar() {
        var mes = document.getElementById("mes").value
        var ano = document.getElementById("ano").value
        var valor = document.getElementById("valor").value
        if ((mes == "") || (mes == undefined) || (ano == "") || (ano == undefined) || (valor == "") || (valor == undefined)) {
            setTextoModal("Preencha todos os Campos obrigatórios!")
            toggleModalInformacao()
        } else {
            var mes = parseInt(mes)
            var ano = parseInt(ano)
            var valor = parseFloat(valor)
            var possuiCompetencia = false
            var listaCompetenciaTemp = []
            for (var itemCompetenciaTemp of item.competencia) {
                if ((itemCompetenciaTemp.mes == mes) && (itemCompetenciaTemp.ano == ano)) {
                    possuiCompetencia = true
                } else {
                    listaCompetenciaTemp.push(itemCompetenciaTemp)
                }
            }
            var itemTemp = JSON.parse(JSON.stringify(item))
            listaCompetenciaTemp.push({ mes: mes, ano: ano, valor: valor })
            listaCompetenciaTemp = listaCompetenciaTemp.sort((item1, item2) => item1.mes - item2.mes)
            listaCompetenciaTemp = listaCompetenciaTemp.sort((item1, item2) => item1.ano - item2.ano)
            itemTemp.competencia = listaCompetenciaTemp
            if (possuiCompetencia) {
                setTextoModal("Competencia " + mes + "/" + ano + " já inclusa, deseja atualizá-la?")
                setItemModal(itemTemp)
                toggleModalAdicionar()
            } else {
                setItem(itemTemp)
                setListaCompetencia(listaCompetenciaTemp)
                setTextoModal(mes + "/" + ano + " Adicionado com sucesso")
                toggleModalInformacao()
            }
        }
    }
    function adicionarSemCritica(pItem) {
        setItem(pItem)
        setListaCompetencia(pItem.competencia)
        toggleModalAdicionar()

    }
    function salvar() {
        if (possuiErroObrigatorio()) {
            setTextoModal("Preencha todos os Campos obrigatórios!")
            toggleModalInformacao()
        } else {
            if (!item.recorrente) {
                item.mes = ""
                item.ano = ""
            }
            Dado.salvar(item, "saida").then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        router.push(Host.url() + "/saida")
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
        var listaCompetenciaTemp = []
        for (var itemCompetenciaTemp of listaCompetencia) {
            if ((itemCompetenciaTemp.mes != pItem.mes) || (itemCompetenciaTemp.ano != pItem.ano)) {
                listaCompetenciaTemp.push(itemCompetenciaTemp)
            }
        }
        itemTemp.competencia = listaCompetenciaTemp
        setItem(itemTemp)
        setListaCompetencia(listaCompetenciaTemp)
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
                    <Col md={2}>
                        <FormGroup>
                            <Label for="recorrente">Recorrente</Label>
                            <Input type="checkbox" id="recorrente" onChange={mudarRecorrente} />
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup>
                            <Label for="mozao">Mozão</Label>
                            <Input type="checkbox" id="mozao" onChange={mudarMozao} />
                        </FormGroup>
                    </Col>
                    <Row>
                    </Row>
                    <Col md={2}>
                        <FormGroup>
                            <Label for="valor">Valor</Label>
                            <Input type="text" id="valor" onChange={mudarValor} />
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup>
                            <Label for="mes">Mês</Label>
                            <Input type="number" id="mes" onChange={mudarMes} />
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup>
                            <Label for="ano">Ano</Label>
                            <Input type="number" id="ano" onChange={mudarAno} />
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
                                Mês
                            </th>
                            <th>
                                Ano
                            </th>
                            <th>
                                Valor
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaCompetencia && listaCompetencia.map((item) => (
                            <tr onClick={() => preencherCamposEdicao(item)}>
                                <td>
                                    {item.mes}
                                </td>
                                <td>
                                    {item.ano}
                                </td>
                                <td>
                                    {item.valor}
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

    return <Saida />
}
export default Pagina;