const express = require("express")
const {PrismaClient} = require("@prisma/client");
const routes = express.Router()
const prisma = new PrismaClient();

// C
routes.post("/lista", async (request, response) => {
    const { name } = request.body;
    const lista = await prisma.lista.create({
        data: {
            name,
        },
    });
    
    return response.status(201).json(lista);    
});

routes.post("/lista/:listaId/sublista", async (request, response) => {
    const { listaId } = request.params;
    const { name } = request.body;

    try {
        const sublista = await prisma.subLista.create({
            data: {
                name,
                lista: {
                    connect: { id: parseInt(listaId) },
                },
            },
        });

        return response.status(201).json(sublista);
    } catch (error) {
        return response.status(400).json({ error: "Erro ao criar a sublista" });
    }
});


routes.post("/sublista/:sublistaId/subsub", async (request, response) => {
    const { sublistaId } = request.params; 
    const { name, status } = request.body; 
    try {
        const subsub = await prisma.subSub.create({
            data: {
                name,
                status,
                sublista: {
                    connect: { id: parseInt(sublistaId) }, 
                },
            },
        });

        return response.status(201).json(subsub);
    } catch (error) {
        return response.status(400).json({ error: "Erro ao criar a sub-sublista" });
    }
});


// R
routes.get("/lista", async (request, response) => {
    try {
        const listas = await prisma.lista.findMany({
            include: {
                items: true, 
            },
        });

        return response.status(200).json(listas);
    } catch (erro) {
        return response.status(400).json({ error: "Erro ao procurar Listas" });
    }
});


routes.get("/sublista/:listaId", async (request, response) => {
    const { listaId } = request.params;

    try {
        const sublistas = await prisma.subLista.findMany({
            where: {
                listaId: parseInt(listaId) // Convertendo para inteiro se necessário
            },
            include: {
                items: true
            },
        });

        return response.status(200).json(sublistas);
    } catch (error) {
        console.error("Erro ao buscar sublistas:", error);
        return response.status(500).json({ error: "Erro interno ao buscar sublistas." });
    }
});



routes.get("/subsub/:sublistaId", async (request, response) => {
    const { sublistaId } = request.params;

    try {
        const subsubs = await prisma.subSub.findMany({
            where: {
                sublistaId: parseInt(sublistaId) // Convertendo para inteiro se necessário
            }
        });

        return response.status(200).json(subsubs);
    } catch (error) {
        console.error("Erro ao buscar subsubs:", error);
        return response.status(500).json({ error: "Erro interno ao buscar subsubs." });
    }
});



// U

routes.put("/lista/:id", async (request, response) => {
    const { id } = request.params;
    const { name } = request.body;

    if (!id) {
        return response.status(400).json({ error: "Id é obrigatório" });
    }

    try {
        const listaExiste = await prisma.lista.findUnique({
            where: { id: parseInt(id) }
        });

        if (!listaExiste) {
            return response.status(404).json({ error: "Id não existe" });
        }

        const lista = await prisma.lista.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name,
            },
        });

        return response.status(200).json(lista);
    } catch (error) {
        return response.status(500).json({ error: "Erro ao atualizar a lista" });
    }
});


routes.put("/sublista/:id", async (request, response) => {
    const { id } = request.params;
    const { name } = request.body;

    if (!id) {
        return response.status(400).json({ error: "Id é obrigatório" });
    }

    try {
        const sublistaExiste = await prisma.subLista.findUnique({
            where: { id: parseInt(id) }
        });

        if (!sublistaExiste) {
            return response.status(404).json({ error: "Id não existe" });
        }

        const sublista = await prisma.subLista.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name,
            },
        });

        return response.status(200).json(sublista);
    } catch (error) {
        return response.status(500).json({ error: "Erro ao atualizar a sublista" });
    }
});


routes.put("/subsub/:id", async (request, response) => {
    const { id } = request.params;
    const { name, status } = request.body;

    if (!id) {
        return response.status(400).json({ error: "Id é obrigatório" });
    }

    try {
        const subsubExiste = await prisma.subSub.findUnique({
            where: { id: parseInt(id) }
        });

        if (!subsubExiste) {
            return response.status(404).json({ error: "Id não existe" });
        }

        const subsub = await prisma.subSub.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name,
                status,
            },
        });

        return response.status(200).json(subsub);
    } catch (error) {
        return response.status(500).json({ error: "Erro ao atualizar a sub-sublista" });
    }
});




// D

routes.delete("/lista/:id", async (request, response) => {
    const { id } = request.params;
    const intId = parseInt(id);

    if (!intId) {
        return response.status(400).json({ error: "Id é obrigatório" });
    }

    try {
        const listaExiste = await prisma.lista.findUnique({
            where: { id: intId }
        });

        if (!listaExiste) {
            return response.status(404).json({ error: "Id não existe" });
        }

        const subListas = await prisma.subLista.findMany({
            where: { listaId: intId },
            select: { id: true }
        });

        const subListaIds = subListas.map(subLista => subLista.id);

        await prisma.subSub.deleteMany({
            where: {
                sublistaId: {
                    in: subListaIds
                }
            }
        });

        await prisma.subLista.deleteMany({
            where: { listaId: intId }
        });

        await prisma.lista.delete({ where: { id: intId } });

        return response.status(200).send();
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: "Erro ao deletar a lista" });
    }
});



routes.delete("/sublista/:id", async (request, response) => {
    const { id } = request.params;
    const intId = parseInt(id);

    if (!intId) {
        return response.status(400).json({ error: "Id é obrigatório" });
    }

    try {
        const sublistaExiste = await prisma.subLista.findUnique({
            where: { id: intId }
        });

        if (!sublistaExiste) {
            return response.status(404).json({ error: "Sublista não existe" });
        }

        await prisma.subSub.deleteMany({
            where: { sublistaId: intId }
        });
        
        await prisma.subLista.delete({ where: { id: intId } });

        return response.status(200).send();
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: "Erro ao deletar a sublista" });
    }
});


routes.delete("/subsub/:id", async (request, response) => {
    const { id } = request.params;
    const intId = parseInt(id);

    if (!intId) {
        return response.status(400).json({ error: "Id é obrigatório" });
    }

    try {
        const subsubExiste = await prisma.subSub.findUnique({
            where: { id: intId }
        });

        if (!subsubExiste) {
            return response.status(404).json({ error: "Subsublista não existe" });
        }

        await prisma.subSub.delete({ where: { id: intId } });

        return response.status(200).send();
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: "Erro ao deletar a subsublista" });
    }
});




module.exports = routes;