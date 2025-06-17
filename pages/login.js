import { useState, React, useEffect } from 'react';
import { Container, Label, Input, Button, Form, FormGroup, Modal, ModalHeader, ModalBody } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router'
import Host from '../dado/host';
import Usuario from '../dado/usuario'
import Dado from '../dado/generico.js'
import Carregamento from './carregamento';
function Login() {

    const router = useRouter()
    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");
    const [residencia, setResidencia] = useState("");
    const [listaResidencia, setListaResidencia] = useState("");
    const [carregando, setCarregando] = useState("")
    const [textoModal, setTextoModal] = useState("")

    const [modal, setModal] = useState(false);

    const toggleModal = () => setModal(!modal);

    useEffect(() => {
        listar()
    }, [])
    function listar() {
        setCarregando(true)
        if (Usuario.autenticado()) {
            router.push(Host.url())
        }

        Dado.listarResidencia()
            .then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        setListaResidencia(response.data.lista)
                    } else {
                        setListaResidencia([])
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


    function mudarNome(event) {
        setNome(event.target.value)

    }
    function mudarSenha(event) {
        setSenha(event.target.value)
    }
    function mudarResidencia(event) {
        setResidencia(event.target.value)
    }


    function entrar() {
        if (possuiErroObrigatorio()) {
            setTextoModal("Preencha todos os Campos obrigatórios!")
            toggleModal()
            //alert("Preencha todos os Campos obrigatórios!")
        } else {

            Usuario.autenticar(nome, senha, residencia).then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        var item = response.data.item
                        Usuario.setUsuario(item._id)
                        Usuario.setResidencia(item.residencia)
                        Usuario.setNivel(item.nivel)
                        router.push(Host.url())
                    } else {
                        setTextoModal(response.data.descricao)
                        toggleModal()
                    }
                }
            }, (error) => {
                console.log("error: " + error)
                setTextoModal(error)
                toggleModal()
            })

        }
    }
    function possuiErroObrigatorio() {
        if (nome == "" || nome == undefined) {
            return true;
        }
        if (senha == "" || senha == undefined) {
            return true;
        }
        if (residencia == "" || residencia == undefined) {
            return true;
        }

        return false;
    }



    return (
        <Container>
            <Form>

                <FormGroup>
                    <Label for="residencia">Residencia</Label>
                    <Input type="select" id="residencia" onChange={mudarResidencia}>
                        <option value="">Selecione</option>
                        {listaResidencia && listaResidencia.map((item) => (
                            <option value={item._id}>{item.descricao}</option>
                        ))}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="nome">Nome</Label>
                    <Input type="text" id="nome" onChange={mudarNome} />
                </FormGroup>
                <FormGroup>
                    <Label for="Senha">Senha</Label>
                    <Input type="password" id="senha" onChange={mudarSenha} />
                </FormGroup>
                <FormGroup>
                    <Button color="danger" onClick={entrar}>Entrar</Button>
                </FormGroup>
            </Form>

            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Informação</ModalHeader>
                <ModalBody>
                            {textoModal}
                </ModalBody>
            </Modal>
            {carregando &&
                <Carregamento />
            }
        </Container>
    );
}

function Pagina() {

    return <Login/>
}
export default Pagina;