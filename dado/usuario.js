import Dado from './generico'
import sha256 from 'crypto-js/sha256';
import { setCookie } from 'cookies-next';
import { hasCookie } from 'cookies-next';
import { deleteCookie } from 'cookies-next';
import { getCookie } from 'cookies-next';

export default class Usuario {

  static autenticar(pNome, pSenha,pResidencia) {
    var senha256 = sha256(pSenha)
    var item = {senha: ""+senha256 ,residencia:pResidencia,nome: pNome}
    return Dado.autenticar(item, "usuario")
  }
  static autenticado() {
    return hasCookie('usuario');
  }
  static sair() {
    deleteCookie('usuario');
    deleteCookie('empresa');
    deleteCookie('nivel');
  }

  static getUsuario() {
    return getCookie('usuario')
  }
  static getResidencia() {
    return getCookie('residencia')
  }
  static getNivel() {
    return getCookie('nivel')
  }
  static setUsuario(usuario) {
    setCookie('usuario', usuario);
  }
  static setResidencia(residencia) {
    setCookie('residencia', residencia);
  }
  static setNivel(nivel) {
    setCookie('nivel', nivel);
  }
}