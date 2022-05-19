const express = require('express')
const router = express.Router()
const mysql = require('../../database/mysql').pool
const loginArtista = require('../middleware/loginArtista')
const loginCliente = require('../middleware/loginCliente')



router.get('/avaliacaoDeArtista/:idArtista', (req, res, next) => {

    const idArtista = req.params.idArtista
 
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(
            `SELECT AVG(DISTINCT avaliacaoArtista) as notaArtista FROM tblAvaliacaoArtista WHERE idArtista = ?`,
            [idArtista],

            (error, results, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    avaliacaoArtista: results.map(avaliacaoArtista => {
                        return {
                            notaArtista: avaliacaoArtista.notaArtista
                        }   
                    })
                }

                return res.status(201).send(response)
            }
        )
    })
})

router.get('/avaliacaoDeCliente/:idCliente', (req, res, next) => {

    const idCliente = req.params.idCliente
 
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(
            `SELECT AVG(DISTINCT avaliacaoCliente) as notaCliente FROM tblAvaliacaoCliente WHERE idCliente = ?`,
            [idCliente],

            (error, results, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    avaliacaoCliente: results.map(avaliacaoCliente => {
                        return {
                            notaCliente: avaliacaoCliente.notaCliente
                        }   
                    })
                }

                return res.status(201).send(response)
            }
        )
    })
})



router.post('/avaliarArtista/:idArtista', loginCliente, (req, res, next) => {

    const idCliente = req.cliente.id_Cliente
    const idArtista = req.params.idArtista
    const { avaliacaoArtista, descricao } = req.body

    mysql.getConnection((error, conn) => {

        conn.query(
            `INSERT INTO tblAvaliacaoArtista(idCliente,idArtista,avaliacaoArtista,descricao) VALUES(?,?,?,?)`,
            [idCliente, idArtista, avaliacaoArtista, descricao],

            (error, results, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Avaliação enviada com sucesso',
                }

                return res.status(201).send(response)
            }
        )


    })

})

router.post('/avaliarCliente/:idCliente', loginArtista, (req, res, next) => {

    const idArtista = req.artista.id_Artista
    const idCliente = req.params.idCliente
    const { avaliacaoCliente, descricao } = req.body

    mysql.getConnection((error, conn) => {

        conn.query(
            `INSERT INTO tblAvaliacaoCliente(idCliente,idArtista,avaliacaoCliente,descricao) VALUES(?,?,?,?)`,
            [idCliente, idArtista, avaliacaoCliente, descricao],

            (error, results, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Avaliação enviada com sucesso',
                }

                return res.status(201).send(response)
            }
        )

        
    })

})


module.exports = router