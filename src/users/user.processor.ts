import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Processor('user')
export class UserProcessor {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private dataSource: DataSource,
    ) { }

    @Process('user-get-by-id')
    async handleSchdeduleUser(job: Job) {
        console.log('Initiating queue')
        try {
            const data = job.data;
            console.log('data', data)
            return data
        } catch (error) {
            console.log(error);
        }
    }
}
