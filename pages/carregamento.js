import { React } from 'react';
import { Container} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Carregamento() {
    return (
        <Container>
            <div class="telaCarregamento" >

                <img src="/carregamento.svg" alt="" class="imgLoad" />

            </div>
        </Container>
    );
}

function Pagina() {
    return <Carregamento />
}
export default Pagina;