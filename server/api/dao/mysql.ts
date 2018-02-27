/*
 * Copyright 2018 Willamette University
 *
 * This file is part of commons-oai-provider.
 *
 * commons-oai-provider is based on the Modular OAI-PMH Server, University of Helsinki, The National Library of Finland.
 *
 *     commons-oai-provider is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     Foobar is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with commons-oai-provider.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as mysql from 'mysql';
import {Connection} from "mysql";
import logger from '../../common/logger';

export class MysqlConnector {

    private connection: Connection;
    public static instance: MysqlConnector;

    /**
     * TODO: Move database configuration to file.
     */
    private constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'tagger-test',
            password: 'taggertest',
            database: 'tagger_option_one'
        });
    }

    public static getInstance(): MysqlConnector {
        try {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new MysqlConnector();
            return this.instance;

        } catch (err) {
            throw new Error('Creating the backend module failed: ' + err.message);
        }
    }

    public recordsQuery(parameters: any): Promise<any> {
        let whereClause: string = "";
        if (parameters.from && parameters.until) {
            const until = this.connection.escape(parameters.until);
            const from = this.connection.escape(parameters.from);
            whereClause = " c.published = true AND c.updatedAt >= "
                + from + " AND c.updatedAt <= " + until;
        }
        else if (parameters.from) {
            const from = this.connection.escape(parameters.from);
            whereClause = " c.published = true AND c.updatedAt >= " + from;
        } else {
            whereClause = " c.published = true ";
        }
        logger.debug(whereClause)
        return new Promise((resolve: any, reject: any) => {
            this.connection.query('Select c.updatedAt, c.title, c.description, c.url, c.id, c.restricted, ' +
                'cr.title AS category FROM Collections c JOIN CategoryTargets ct on ct.CollectionId=c.id ' +
                'JOIN Categories cr on ct.CategoryId=cr.id WHERE ' + whereClause,
                (err: Error, rows: any[]) => {
                    if (err) {
                        logger.debug(err);
                        return reject(err);
                    }
                    resolve(rows);
                });
        });

    }

    public identifiersQuery(parameters: any): Promise<any> {
        let query: string = "";
        if (parameters.from && parameters.until) {
            const until = this.connection.escape(parameters.until);
            const from = this.connection.escape(parameters.from);
            query = "Select id, updatedAt FROM Collections WHERE published = true AND updatedAt >= "
                + from + " AND updatedAt <= " + until;

        }
        else if (parameters.from) {
            const from = this.connection.escape(parameters.from);
            query = "Select id, updatedAt FROM Collections WHERE published = true AND updatedAt >= " + from;
        } else {
            query = "Select id, updatedAt FROM Collections WHERE published = true ";
        }
        logger.debug(query);
        return new Promise((resolve: any, reject: any) => {
            this.connection.query(query,
                (err: Error, rows: any[]) => {
                    if (err) {
                        logger.debug(err);
                        return reject(err);
                    }
                    resolve(rows);
                });
        });
    }

    public getRecord(id: string): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            const query = 'Select c.updatedAt, c.title, c.description, c.url, c.id, c.restricted, ' +
                'cr.title AS category FROM Collections c JOIN CategoryTargets ct on ct.CollectionId=c.id ' +
                'JOIN Categories cr on ct.CategoryId=cr.id WHERE c.id=' +
                this.connection.escape(id) + ' AND c.published = true';
            logger.debug(query);
            this.connection.query(query,
                (err: Error, rows: any[]) => {
                    if (err) {
                        logger.debug(err);
                        return reject(err);
                    }
                    resolve(rows);
                });
        });
    }

    public close(): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            this.connection.end((err: Error) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }

}