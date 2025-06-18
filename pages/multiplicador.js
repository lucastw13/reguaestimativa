import { useState, React, useEffect } from 'react';
import Menu from './menu.js';
import { Container, Table, Label, Input, ModalFooter, Modal, ModalBody, ModalHeader ,Button} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dado from '../dado/generico.js';
import Host from '../dado/host.js';
import { useRouter } from 'next/router'
import Carregamento from './carregamento.js';
function Multiplicador() {
    const [lista, setLista] = useState("");
    
    const [listaRecorrente, setListaRecorrente] = useState("");
    const [listaExibir, setListaExibir] = useState("");
    const router = useRouter();
    const [carregando, setCarregando] = useState("")
    const [itemModal, setItemModal] = useState("");
    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);
    useEffect(() => {
        listar()
    }, [])

    function listar() {
        setCarregando(true)
        Dado.listar("multiplicador")
            .then(response => {
                if (response.data != null) {
                    if (response.data.status) {
                        setLista(response.data.lista);
                        setListaRecorrente(response.data.listaRecorrente);
                        console.log(document.getElementById("recorrente").checked)
                        if(document.getElementById("recorrente").checked){
                            setListaExibir(response.data.listaRecorrente)
                        }else{
                            setListaExibir(response.data.lista)
                        }
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

    function deletarToggle(item) {
        setItemModal(item)
        toggleModal()
    }
    function deletar(item) {
        Dado.deletar(item._id, "multiplicador")
            .then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        listar()
                    } else {
                        console.log("error: " + response.data.descricao)
                    }
                }
            }, (error) => {
                console.log("error: " + error)
            })
            .finally(() => {
                toggleModal()
            });


    }

    function mudarRecorrente(event) {
        if (event.target.checked) {
            setListaExibir(listaRecorrente)
        } else {
            setListaExibir(lista)
        }
    }
    return (
        <Container>
            <Menu descricao="Saídas" />
            <Label for="recorrente">Recorrente</Label>
            <Input type="checkbox" id="recorrente" onChange={mudarRecorrente} />
            <Table>
                <thead>
                    <tr>
                        <th>
                            Pergunta
                        </th>
                        <th>
                            Desvio
                        </th>
                        <th>
                            <a href={Host.url() + "/multiplicador/incluir"}>
                                <img src='/+.png' width="20px" />
                            </a>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {listaExibir && listaExibir.map((item) => (
                        <tr>
                            <td onClick={() => router.push(Host.url() + "/multiplicador/" + item._id)}>
                                {item.pergunta}
                            </td>
                            <td>
                                {item.desvio}
                            </td>
                            <td>
                                <img src='/x.png' width="20px" onClick={() => deletarToggle(item)} />

                            </td>

                        </tr>

                    ))}
                </tbody>
            </Table>
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Confirmação</ModalHeader>
                <ModalBody>
                    Deseja excluir a multiplicador:  {itemModal.descricao}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={()=>deletar(itemModal)}>
                        OK
                    </Button>{' '}
                    <Button color="secondary" onClick={toggleModal}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>
            {carregando &&
                <Carregamento />
            }
            {carregando &&
                <Carregamento />
            }
        </Container>
    );


}


function Pagina() {
    return <Multiplicador />
}


export default Pagina;