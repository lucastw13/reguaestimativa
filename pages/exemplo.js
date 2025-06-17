import { useState, React } from 'react';
import { Button, Container, Form, Label, Input, FormGroup } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Endereco() {
    const [endereco, setEndereco] = useState("");
    const [url, setUrl] = useState("");
    const [entrou, setEntrou] = useState("");
    const [cep, setCep] = useState("");
    var response = ""

    function mudaCep(event) {
        setCep(event.target.value);
    }
    function buscarEndereco() {
        if (cep != "") {
            /* axios.get("https://viacep.com.br/ws/" + cep + "/json")
                 .then(response => {
                     if (response.data != null)
                         setEndereco(response.data.logradouro + " - " + response.data.bairro + " - " + response.data.localidade + " - " + response.data.uf);
                     else
                         setEndereco("")
                 }, (error) => {
                     setEndereco("")
                 });*/
            var varUrl = "https://gestaocomercialapi.herokuapp.com/insumo"
            setUrl(varUrl)
            axios.get(varUrl)
                .then(response => {
                    if (response.data != null) {
                        setEntrou("entrou no response")
                        setEndereco(JSON.stringify(response.data));
                    } else {
                        setEndereco("")
                    }
                }, (error) => {
                    setEndereco("")
                });

        }
    }

    return (
        <Container>

            <Label for="00000000">CEP</Label>
            <Input type="text" name="cep" id="cep" placeholder="00000000" onChange={mudaCep} />
            <Button color="danger" onClick={buscarEndereco}>Buscar Endereço</Button>
            <h1>{url}</h1>
            <h1>{entrou}</h1>
            <div>{endereco}</div>
        </Container>

    )

}

function Pagina() {
    return <Endereco />
}
export default Pagina;

