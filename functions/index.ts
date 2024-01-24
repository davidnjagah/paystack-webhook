import {onRequest} from "firebase-functions/v2/https";

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { createHmac } from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Function to add one month
function addOneMonth(date: Date) {
    // Get the current day (of the month)
    const currentDay = date.getDate();

    // Add one month
    date.setMonth(date.getMonth() + 1);

    // Check if the day has changed (month overflow case)
    // If so, set the date to the last day of the previous month
    if (date.getDate() !== currentDay) {
        date.setDate(0);
    }
}

export const paystackWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    const prisma = new PrismaClient()
    const secret = process.env.PAYSTACK_SECRET_KEY!;

    const hash = createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');

    if (hash == req.headers['x-paystack-signature']) {

    const event = req.body;

    const date = new Date(event.data.created_at);

    const currentDate = new Date(event.data.created_at);

    const amount = event.data.amount.toString();
    
    addOneMonth(date);

    const paystackSubscription = await prisma.paystackSubscription.findUnique({ 
        where: {
            userEmail: event.data.customer.email,
        }
    });
    
    const userApiLimit = await prisma.userApiLimit.findUnique({ 
        where: {
            userEmail: event.data.customer.email,
        }
    });
    
    res.json({status: 200});

            
    if (event.event === "charge.success") {
            if (userApiLimit) {
                const remainingCount = userApiLimit.userMaxCount - userApiLimit?.count;
                const newMaxCount = remainingCount + 10;

                await prisma.userApiLimit.update({
                    where: {
                        userEmail: event.data.customer.email,
                    },
                    data: {
                        count: 0,
                        userMaxCount: newMaxCount,
                    },
                });
            } else {
                await prisma.userApiLimit.create({
                    data:{
                        userEmail: event.data.customer.email,
                        count: 0,
                        userMaxCount: 11,
                    }
                })
            }
            if (paystackSubscription) {
                await prisma.paystackSubscription.update({
                    where: {
                        userEmail: event.data.customer.email,
                    },
                    data: {
                        paystackAmountPaid: amount,
                        paystackDatePaid: currentDate,
                        paystackCurrentPeriodEnd: date,
                    },
                });
            }
            else {
                await prisma.paystackSubscription.create({
                    data: {
                        userEmail: event.data.customer.email,
                        paystackCustomerId: event.data.customer.customer_code as string,
                        paystackAmountPaid: amount,
                        paystackDatePaid: currentDate,
                        paystackCurrentPeriodEnd: date,
                    },
                });
            };
        };
    
    };
    
}


app.post('/api/webhook', paystackWebhook);

export const pswebhook  = onRequest(app);