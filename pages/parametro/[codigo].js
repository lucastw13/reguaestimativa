import { useState, React, useEffect } from 'react';
import Menu from '../menu';
import { Container, Label, Input, Button, Form, FormGroup } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dado from '../../dado/generico.js'
import { useRouter } from 'next/router'
import Host from '../../dado/host';
import Carregamento from '../carregamento';
function Parametro() {
    const [item, setItem] = useState("");
    const router = useRouter()
    const [carregando, setCarregando] = useState("")

    useEffect(() => {
        if ((router.query.codigo != "") && (router.query.codigo != undefined)) {
            if (router.query.codigo == "incluir") {
                setItem({ chave: "", valor: "" })
            }
            listar(router.query.codigo)
        }
    }, [router.query.codigo])
    function listar(pCodigo) {
        setCarregando(true)
        Dado.item(pCodigo, "parametro")
            .then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        setItem(response.data.item)
                        document.getElementById("chave").value = response.data.item.chave;
                        document.getElementById("valor").value = response.data.item.valor;
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

    function mudarChave(event) {
        var itemTemp = item
        itemTemp.chave = event.target.value
        setItem(itemTemp);
    }

    function mudarValor(event) {
        var itemTemp = item
        itemTemp.valor = event.target.value
        setItem(itemTemp);
    }


    function salvar() {
        if (possuiErroObrigatorio()) {
            //alert("Preencha todos os Campos obrigatórios!")
        } else {
            Dado.salvar(item, "parametro").then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        router.push(Host.url() + "/parametro")
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
        if (item.chave == "" || item.chave == undefined) {
            return true;
        }
        if (item.valor == "" || item.valor == undefined) {
            return true;
        }

        return false;
    }



    return (
        <Container>
            <Menu descricao="Parametros"/>
            <Form>
                <FormGroup>
                    <Label for="chave">Chave</Label>
                    <Input type="text" id="chave" onChange={mudarChave} />
                </FormGroup>
                <FormGroup>
                    <Label for="valor">Valor</Label>
                    <Input type="text" id="valor" onChange={mudarValor} />
                </FormGroup>
                <Button color="danger" onClick={salvar}>Salvar</Button>
            </Form>
            {carregando &&
                <Carregamento />
            }
        </Container>
    );
}

function Pagina() {

    return <Parametro />
}
export default Pagina;