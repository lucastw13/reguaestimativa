import axios from 'axios';
import Host from '../dado/host'
import Usuario from "../dado/usuario.js";
export default class Generico {

  static testeConexao(){
    return axios.get(Host.urlApi())
  }
  static listar(entidade) {
    var residencia = Usuario.getResidencia();
    var link = Host.urlApi() + "/" + entidade + "/codigo/" + residencia
    return axios.get(link)
  }

  static listarResidencia() {
    return axios.get(Host.urlApi() + "/residencia")
  }
  
  static item(codigo, entidade) {
    return axios.get(Host.urlApi() + "/" + entidade + "/" + codigo)
  }
  
  static deletar(codigo, entidade) {
    return axios.delete(Host.urlApi() + "/" + entidade + "/" + codigo);
  }
  static paguei(codigo,mes,ano) {
    return axios.get(Host.urlApi() + "/paguei/"+codigo+"/"+mes+"/"+ano)
  }
  static confirmei(codigo,mes,ano) {
    return axios.get(Host.urlApi() + "/confirmei/"+codigo+"/"+mes+"/"+ano)
  }
  
  static salvar(item, entidade) {
    var dateTime = new Date()
    if (item._id == "" || item._id == undefined) {
      item.residencia = Usuario.getResidencia();
      item.data = dateTime.toLocaleDateString();
      item.hora = dateTime.toLocaleTimeString();
      item.usuario = Usuario.getUsuario();
      return axios.post(Host.urlApi() + "/" + entidade, item);
    } else {
      item.residencia = Usuario.getResidencia();
      item.dataAlteracao = dateTime.toLocaleDateString();
      item.horaAlteracao = dateTime.toLocaleTimeString();
      item.usuarioAlteracao = Usuario.getUsuario();
      return axios.put(Host.urlApi() + "/" + entidade, item);
    }
  }
  static autenticar(item){
    return axios.post(Host.urlApi() + "/usuario", item);
  }
  static salvarLista(lista, entidade) {
    
    var dateTime = new Date()
    var listaSalvar = []
    for (var item of lista) {
      if (item._id == "" || item._id == undefined) {
        item.residencia = Usuario.getResidencia();
        item.data = dateTime.toLocaleDateString();
        item.hora = dateTime.toLocaleTimeString();
        item.usuario = Usuario.getUsuario();
        listaSalvar.push(item)
      } 
    }
    if(listaSalvar.length>0){
      return axios.post(Host.urlApi() + "/" + entidade, listaSalvar);
    }else{
      return ""
    }

  }
  static salvarListaSemResidencia(lista, entidade) {
    
    var dateTime = new Date()
    var listaSalvar = []
    for (var item of lista) {
      if (item._id == "" || item._id == undefined) {
        item.data = dateTime.toLocaleDateString();
        item.hora = dateTime.toLocaleTimeString();
        item.usuario = Usuario.getUsuario();
        listaSalvar.push(item)
      } 
    }
    if(listaSalvar.length>0){
      return axios.post(Host.urlApi() + "/" + entidade, listaSalvar);
    }else{
      return ""
    }

  }
  static consultaCep(pCep) {
    return axios.get("https://viacep.com.br/ws/"+pCep+"/json/")
  }

}