const express = require("express");
const res = require("express/lib/response");
const app = express();
const fs = require('fs');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculate-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

function multiple(n1, n2) {
    return n1 * n2;
}

function plus(n1, n2) {
    return n1 + n2;
}

function divide(n1, n2) {
    return n1 / n2;
}

function minus(n1, n2) {
    return n1 - n2;
}
function check(n1,n2) {
    logger.info('Parameters ' + n1 + ' and ' + n2 + ' received for addition');
    if (isNaN(n1)) {
        logger.error("n1 is incorrectly defined");
        throw new Error("n1 incorrectly defined");
    }
    if (isNaN(n2)) {
        logger.error("n2 is incorrectly defined");
        throw new Error("n2 incorrectly defined");
    }
    if (n1 === NaN || n2 === NaN) {
        console.log()
        throw new Error("Parsing Error");
    }
}

app.get("/calculate", (req, res) => {
    const functionType = req.query.func;
    let result; const  n1 = req.query.n1;
    const n2 = req.query.n2;
    try {
        switch (functionType) {
            case 'multiple':

                check(n1,n2)
                result = multiple(req.query.n1, req.query.n2)
                break;
            case 'plus':
                n1 = req.query.n1;
                n2 = req.query.n2;
                check(n1, n2)
                result = plus(req.query.n1, req.query.n2);
                break;
            case 'divide':
                n1 = req.query.n1;
                n2 = req.query.n2;
                check(n1, n2)
                result = divide(req.query.n1, req.query.n2);
                break;

            case 'minus':
                n1 = req.query.n1;
                n2 = req.query.n2;
                check(n1, n2)
                result = minus(req.query.n1, req.query.n2);
                break;
            default:
                result = 'Invalid function';
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ statuscocde: 500, msg: error.toString() })
}

    res.json({ result });
});


const port = 3040;
app.listen(port, () => {
    console.log("hello i'm listening to port " + port);
});