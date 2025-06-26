import { useState, React, useEffect } from 'react';
import Menu from '../menu.js';
import { Container, Label, Input, Button, Table, Form, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dado from '../../dado/generico.js'
import { useRouter } from 'next/router'
import Host from '../../dado/host.js';
import Carregamento from '../carregamento.js';
import styles from './[codigo].module.css'

function Referencia() {
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
        Dado.item(pCodigo, "referencia")
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
                        document.getElementById("artefato").value = response.data.item.artefato;
                        document.getElementById("descricao").value = response.data.item.descricao;
                        document.getElementById("horaReferencia").value = response.data.item.horaReferencia;
                        document.getElementById("tipo").value = response.data.item.tipo;
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

    function mudarArtefato(event) {
        var itemTemp = item
        itemTemp.artefato = event.target.value
        setItem(itemTemp);

    }
    function mudarDescricao(event) {
        var itemTemp = item
        itemTemp.descricao = event.target.value
        setItem(itemTemp);

    }
    function mudarHoraReferencia(event) {
        var itemTemp = item
        itemTemp.horaReferencia = event.target.value
        setItem(itemTemp);

    }
    function mudarTipo(event) {
        var itemTemp = item
        itemTemp.tipo = event.target.value
        setItem(itemTemp);

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
            Dado.salvar(item, "referencia").then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        router.push(Host.url() + "/referencia")
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
            <Menu descricao="Referência" />
            <Form>
            
                <Row>
                    <Col md={10}>
                        <FormGroup>
                            <Label for="artefato">Artefato</Label>
                            <Input type="text" id="artefato" onChange={mudarArtefato} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={10}>
                        <FormGroup>
                            <Label for="descricao">Descricao</Label>
                            <Input type="textarea" id="descricao" onChange={mudarDescricao} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={10}>
                        <FormGroup>
                            <Label for="horaReferencia">Hora</Label>
                            <Input type="text" id="horaReferencia" onChange={mudarHoraReferencia} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={10}>
                        <FormGroup>
                            <Label for="tipo">Tipo</Label>
                            <select name="tipo" id="tipo" onChange={mudarTipo}>
                                <option value="dev">dev</option>
                                <option value="qa">qa</option>
                            </select>
                        </FormGroup>
                    </Col>
                </Row>

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
        </Container >
    );
}

function Pagina() {

    return <Referencia />
}
export default Pagina;