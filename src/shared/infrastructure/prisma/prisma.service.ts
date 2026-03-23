
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';



@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(config: ConfigService) {
        const rawUrl = config.get<string>('DATABASE_URL') || 'file:./dev.db';
        const adapter = new PrismaLibSql({ url: rawUrl });
        super({ adapter });
    }
    async onModuleInit() {
        await this.$connect();
    }
}