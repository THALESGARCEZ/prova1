const express = require('express')
const app = express()
app.use(express.json())

const funcionarios = [
  { matricula: 10, nome: 'Ana', salario: 2000.0 },
  { matricula: 12, nome: 'Pedro', salario: 4000.0 },
  { matricula: 14, nome: 'Rita', salario: 5000.0 },
  { matricula: 16, nome: 'Jose', salario: 6000.0 },
  { matricula: 18, nome: 'Paulo', salario: 7000.0 },
]
// middleware global e local

app.use((request, response, next) => {
  console.log('LPW - NodeJS')
  return next()
})

const funcionarioExiste = (request, response, next) => {
  const { indice } = request.params
  // http://localhost:3333/10
  if (!funcionarios[indice]) { // funcionarios[10]
    return response
      .status(400)
      .json({ error: 'Indice do funcionário inexistente' })
  }
  return next()
}

const funcionarioNaRequisicao = (request, response, next) => {
  if (!request.body.matricula || !request.body.nome || !request.body.salario) {
    return response
      .status(400)
      .json({ Error: 'O campo matricula ou nome ou salário não existe no corpo da requisição' })
  }
  return next()
}

// Listar todos os funcionários
// http://localhost:3333/funcionarios

app.get('/funcionarios', (request, response) => {
  return response.json(funcionarios)
})

// listar funcionário pelo indice
// parâmetro na rota
// http://localhost:3333/funcionarios/1
// request.params
app.get('/funcionarios/:indice', funcionarioExiste, (request, response) => {
  const { indice } = request.params
  return response.json(funcionarios[indice])
})

// incluir funcionário
// método http: post
// request.body
app.post('/funcionarios', funcionarioNaRequisicao, (request, response) => {
  const { matricula, nome, salario } = request.body

  const funcionario = {
    matricula,
    nome,
    salario
  }

  funcionarios.push(funcionario)
  return response.json(funcionarios)
})

// Alterar funcionário
// método http: put
// request.body
app.put('/funcionarios/:indice', funcionarioExiste, funcionarioNaRequisicao, (request, response) => {
  // request.params
  const { indice } = request.params

  // request.body
  const { matricula, nome, salario } = request.body

  const funcionario = {
    matricula,
    nome,
    salario
  }

  // funcionarios[0]
  funcionarios[indice] = funcionario
  return response.json(funcionarios)
})


// Excluir funcionário
// método http: delete
// request.params
app.delete('/funcionarios/:indice', funcionarioExiste, (request, response) => {
  const { indice } = request.params
  funcionarios.splice(indice, 1)
  // filter
  return response.json(funcionarios)
})

app.listen(3333, () => {
  console.log('Servidor rodando')
})