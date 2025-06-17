import { React, useEffect, useState } from 'react';
import { Container, Nav, NavItem, NavLink, Collapse, Navbar, NavbarToggler, NavbarBrand } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dado from '../dado/menu.js'
import Host from '../dado/host'
import Usuario from '../dado/usuario.js';
import { useRouter } from 'next/router'
import { getCookie } from 'cookies-next';
import { setCookie } from 'cookies-next';
import Carregamento from './carregamento';
import DadoGenerico from '../dado/generico.js';

function Menu({ descricao }) {
    const router = useRouter();
    const [autenticado, setAutenticado] = useState("");
    const [nivel, setNivel] = useState("");

    const [collapsed, setCollapsed] = useState(true);

    const toggleNavbar = () => setCollapsed(!collapsed)
    const [carregando, setCarregando] = useState()



    useEffect(() => {

        DadoGenerico.testeConexao()
            .then(response => {
                setCarregando(true)
                if (autenticado == "" || autenticado == undefined) {
                    if (Usuario.autenticado()) {
                        setAutenticado(true)

                    } else {
                        setAutenticado(false)
                        router.push(Host.url() + "/login")
                    }
                } else {
                    if (nivel == "" || nivel == undefined) {
                        setNivel(Usuario.getNivel())
                        var pagina = window.location.href
                        var pagina = pagina.substring(Host.url().length + 1, pagina.length)
                        if (pagina.indexOf("/") != -1) {
                            var pagina = pagina.substring(0, pagina.indexOf("/"))
                        }
                        var bPermitido = true
                        for (var item of Dado.listar().filter(item => item.pagina == pagina)) {
                            if (item.nivel > Usuario.getNivel()) {
                                bPermitido = false
                            }
                        }
                        if (bPermitido == false) {
                            router.push(Host.url())
                        }
                    }
                }
                setCarregando(false)
            }, (error) => {
                setCarregando(true)
                console.log("error: " + error)
            })
    })



    function sair() {
        Usuario.sair()
        router.push(Host.url() + "/login")

    }

    return (
        <Container>
                   Autenticado <img src='/sair.png' width="20px" onClick={sair} />


            <Navbar color="faded" light>
                <NavbarBrand className="me-auto">
                    <b>{descricao}</b>
                    {nivel != "" && nivel != undefined && Dado.listar().filter(item => (item.nivel <= nivel) && item.importante).map((item) => (
                        <a class="link" href={Host.url() + "/" + item.pagina}> - {item.descricao}</a>
                    ))}
                </NavbarBrand>
                <NavbarToggler onClick={toggleNavbar} className="me-2" />
                <Collapse isOpen={!collapsed} navbar>
                    <Nav navbar>
                        {nivel != "" && nivel != undefined && Dado.listar().filter(item => (item.nivel <= nivel) && !item.importante).map((item) => (
                            <NavItem>
                                <NavLink>
                                    <a class="link" href={Host.url() + "/" + item.pagina}>{item.descricao}</a>
                                </NavLink>
                            </NavItem>
                        ))}
                    </Nav>
                </Collapse>
            </Navbar>
            {carregando &&

                <div class="telaCarregamento" >

                    <img src="/carregamento.svg" alt="" class="imgLoad" />

                </div>
            }
            {carregando &&
                <Carregamento />
            }
        </Container>
    );
}
export default Menu;