import { useState, React, useEffect } from 'react';
import Menu from './menu.js';
import { Container, Table, Modal, ModalHeader, ModalBody, Input, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dado from '../dado/generico.js';
import { useRouter } from 'next/router'
import Carregamento from './carregamento.js';
import styles from './index.module.css'
function Competencia() {
   
    return (
        <Container>
            <Menu descricao="" />
            <h1>Régua de Estimativa</h1>
        </Container>
    );


}


function Pagina() {
    return <Competencia />
}


export default Pagina;