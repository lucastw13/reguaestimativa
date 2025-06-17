export default class Menu {
  static listar() {
    var lista = []
    lista.push({ codigo: 1, nivel: 999,importante:0, descricao: "Referência", pagina: "referencia" })
    lista.push({ codigo: 2, nivel: 999,importante:0, descricao: "Multiplicador", pagina: "multiplicador" })
    return lista
  }
}