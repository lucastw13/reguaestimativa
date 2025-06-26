import { useState, React, useEffect } from 'react';
import Menu from './menu.js';
import { Container, Label, Input, Button, Table, Form, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dado from '../dado/generico.js'
import { useRouter } from 'next/router'
import Host from '../dado/host.js';
import Carregamento from './carregamento.js';
import styles from './[codigo].module.css'

function Multiplicador() {
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
        Dado.item(pCodigo, "multiplicador")
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
                        document.getElementById("pergunta").value = response.data.item.pergunta;
                        document.getElementById("desvio").value = response.data.item.desvio;
                        document.getElementById("complexidade").value = response.data.item.complexidade;
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

    function mudarPergunta(event) {
        var itemTemp = item
        itemTemp.pergunta = event.target.value
        setItem(itemTemp);

    }
    function mudarDesvio(event) {
        var itemTemp = item
        itemTemp.desvio = event.target.value
        setItem(itemTemp);

    }
    function mudarComplexidade(event) {
        var itemTemp = item
        itemTemp.complexidade = event.target.value
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
            Dado.salvar(item, "multiplicador").then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        router.push(Host.url() + "/multiplicador")
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
        if (item.pergunta == "" || item.pergunta == undefined) {
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
            <Menu descricao="Multiplicador" />
            <Form>
            
                <Row>
                    <Col md={10}>
                        <FormGroup>
                            <Label for="pergunta">Pergunta</Label>
                            <Input type="textarea" id="pergunta" onChange={mudarPergunta} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={10}>
                        <FormGroup>
                            <Label for="desvio">Desvio</Label>
                            <Input type="text" id="desvio" onChange={mudarDesvio} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={10}>
                        <FormGroup>
                            <Label for="complexidade">Complexidade</Label>
                            <Input type="text" id="complexidade" onChange={mudarComplexidade} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={10}>
                        <FormGroup>
                            <Label for="tipo">Tipo</Label>
                            <Input type="text" id="tipo" onChange={mudarTipo} />
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

    return <Multiplicador />
}
export default Pagina;