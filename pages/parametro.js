import { useState, React, useEffect } from 'react';
import Menu from './menu.js';
import { Container, Table } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dado from '../dado/generico.js';
import Host from '../dado/host';
import { useRouter } from 'next/router'
import Carregamento from './carregamento';
function Parametro() {
    const [lista, setLista] = useState("");
    const router = useRouter()
    const [carregando, setCarregando] = useState("")
    useEffect(() => {
        listar()
    }, [])

    function listar() {
        setCarregando(true)
        Dado.listar("parametro")
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

    function deletar(item) {
        var deletar = confirm("Deseja excluir o Parametro: " + item.descricao + " ?");
        if (deletar) {
            Dado.deletar(item._id, "parametro")
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
        }

    }
    return (
        <Container>
            <Menu descricao="Parametros"/>
            <Table>
                <thead>
                    <tr>
                        <th>
                            Chave
                        </th>
                        <th>
                            Valor
                        </th>
                        <th>
                            <a href={Host.url() + "/parametro/incluir"}>
                                <img src='/+.png' width="20px" />
                            </a>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {lista && lista.map((item) => (
                        <tr onClick={() => router.push(Host.url() + "/parametro/" + item._id)}>
                            <td>
                                {item.chave}
                            </td>
                            <td>
                                {item.valor}
                            </td>
                            <td>
                                <img src='/x.png' width="20px" onClick={() => deletar(item)} />

                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {carregando &&
                <Carregamento/>
            }
        </Container>
    );


}


function Pagina() {
    return <Parametro />
}


export default Pagina;