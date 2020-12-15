const app = require("../src/app")
const logger = require("../src/logger")
const mealsRouter = express.Router()



const meals = [{
    id: 1,
    meal_name: 'Meal',
    img_url: 'https://image.com',
    ingredients: 'Ingredients',
    chef: 'Chef',
    origin: 'Origin Cuisine'
}]


app.get('/meals', (req, res) => {
    res.json(meals)
})


app.get('/meals/:id', (req, res) => {
    const { id } = req.params;
    const meal = meals.find(m => m.id == id)

    if(!meal) {
        logger.error(`Meal with id ${id} not found.`)
        return res.status(404).send('Meal Not Found')
    }
    res.json(meal)
})




app.post('/meals', (req, res) => {
    const { meal_name, img_url, ingredients, chef, origin} = req.body;

    if(!meal_name) {
        logger.error(`Meal Name is required.`)
        return res.status(400).send(`Invalid Data`);
    }

    if(!img_url) {
        logger.error(`Meal Image is required.`)
        return res.status(400).send(`Invalid Data`);
    }

    if(!ingredients) {
        logger.error(`Meal Ingredients are required.`)
        return res.status(400).send(`Invalid Data`);
    }

    if(!chef) {
        logger.error(`Meal Chef is required.`)
        return res.status(400).send(`Invalid Data`);
    }

    if(!origin) {
        logger.error(`Meal Origin is required.`)
        return res.status(400).send(`Invalid Data`);
    }

    const id = uuid()

    const meal = {
        id, 
        meal_name,
        img_url, 
        ingredients,
        chef,
        origin
    }

    meals.push(meal)

    logger.info(`Meal with id ${id} has been created.`)

    res.status(201)
        .location(`http://localhost:8000/meals/${id}`)
        .json({id})

})



app.delete('/meals/:id', (req, res) => {
    const { id } = req.params

    const mealIndex = meals.findIndex(mi => mi.id == id)

    if(mealIndex === -1) {
        logger.error(`Meal wit id ${id} not found.`)
        return res.status(404).send(`Not Found`)
    }

    meals.splice(mealIndex, 1)

    logger.info(`Meal with id ${id} has been deleted.`)
    res.status(204)
        .end()
})