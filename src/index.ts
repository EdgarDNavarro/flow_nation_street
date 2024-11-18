import server from './server'
import colors from 'colors'

const port = process.env.PORT || 4003

server.listen(port, () => {
    console.log(colors.cyan.bold.italic(`------------------------------`))
    console.log(colors.cyan.bold.italic(`Server running on port ${port}`))
    console.log(colors.cyan.bold.italic(`------------------------------`))
})