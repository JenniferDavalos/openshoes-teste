const express = require('express')
const cors = require('cors')
const pg = require('pg')

const app = express()
const port = process.env.PORT

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

const consST = process.env.DATABASE_URL
const pool = new pg.Pool({ connectionString: consST })

//Cadastrar produto
app.post('/products', (req, res) => {
  pool.connect((err, client) => {
    if (err) {
      //O Node.js não conseguiu se conectar com o banco de dados
      return res.status(401).send({
        message: 'Conexão não autorizada!',
        status: false
      })
    }
    var insertSQL =
      'insert into products(productModel, productPrice, productSize, productCategory, sellersName)values($1, $2, $3, $4, $5 )'
    var productData = [
      req.body.productModel,
      req.body.productPrice,
      req.body.productSize,
      req.body.productCategory,
      req.body.sellersName
    ]
    client.query(insertSQL, productData, (error, result) => {
      if (error) {
        //O banco de dados não conseguiu criar o usuário
        return res.status.apply(500).send({
          message: 'Erro ao finalizar cadastro',
          status: false
        })
      }
      return res.status(201).send({
        message: 'Cadastro feito com sucesso!',
        status: true
      })
    })
  })
})

//Atualizar produto
app.put('/products/:productCode', (req, res) => {
  pool.connect((err, client) => {
    if (err) {
      //O Node.js não conseguiu se conectar com o banco de dados
      return res.status(401).send({
        message: 'Conexão não autorizada',
        status: false
      })
    }
    var updateSQL =
      'update products set productModel = $1, productPrice = $2, productSize = $3, productCategory = $4, sellersName = $5  where productCode = $6'
    var productData = [
      req.body.productModel,
      req.body.productPrice,
      req.body.productSize,
      req.body.productCategory,
      req.body.sellersName,
      req.params.productCode
    ]

    client.query(updateSQL, productData, (error, result) => {
      if (error) {
        //O Node.js não conseguiu integrar as propriedades
        return res.status(500).send({
          message: 'Erro ao atualizar produto',
          status: false
        })
      }

      return res.status(200).send({
        message: 'Produto atualizado com sucesso!',
        status: true
      })
    })
  })
})

//Consultar todos os produtos --> Olhar linha 106
app.get('/products', (req, res) => {
  pool.connect((err, client) => {
    if (err) {
      //O Node.js não conseguiu se conectar com o banco de dados
      return res.status(401).send({
        message: 'Conexão não autorizada!',
        status: false
      })
    }
    var searchAllSQL = 'select * from products'
    client.query(searchAllSQL, (error, result) => {
      if (error) {
        //O banco de dados não conseguiu consultar os produtos
        return res.status(500).send({
          message: 'Erro ao buscar produtos',
          status: false
        })
      }
      var products = result.rows
      return res.status(201).send({
        products,
        status: true
      })
    })
  })
})

//Consultar um produto
app.get('/products/:productCode', (req, res) => {
  pool.connect((err, client) => {
    if (err) {
      //O Node.js não conseguiu se conectar com o banco de dados
      return res.status(401).send({
        message: 'Conexão não autorizada',
        status: false
      })
    }
    var searchOneSQL = 'select * from products where productCode = $1'
    var productData = [req.params.productCode]
    client.query(searchOneSQL, productData, (error, result) => {
      if (error) {
        //O banco de dados não conseguiu consultar o produto
        return res.status(500).send({
          message: 'Erro ao buscar produto',
          status: false
        })
      }
      var product = result.rows[0]
      return res.status(201).send({
        product,
        status: true
      })
    })
  })
})

app.delete('/products/:productCode', (req, res) => {
  pool.connect((err, client) => {
    if (err) {
      //O Node.js não conseguiu se conectar com o banco de dados
      return res.status(401).send({
        message: 'Conexão não autorizada',
        status: false
      })
    }
    var deleteSQL = 'delete from products where productCode = $1'
    var productData = [req.params.productCode]
    client.query(deleteSQL, productData, (error, result) => {
      if (error) {
        //O banco de dados não conseguiu deletar o produto
        res.status(500).send({
          message: 'Erro ao deletar produto',
          status: false
        })
      }
      return res.status(201).send({
        message: 'Produto excluído com sucesso!'
      })
    })
  })
})

app.listen(port, () => {
  console.log(`executando em http://localhost:${port}`)
})
