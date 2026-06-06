import 'reflect-metadata'
import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { Aluno } from '../../../modules/alunos/entities/Aluno'
import { Aula } from '../../../modules/aulas/entities/Aula'
import { Dispositivo } from '../../../modules/dispositivos/entities/Dispositivo'
import { InscricaoTurma } from '../../../modules/inscricoesturmas/entities/InscricaoTurma'
import { LogAcesso } from '../../../modules/logacessos/entities/LogAcesso'
import { Professor } from '../../../modules/professores/entities/Professor'
import { RegistroPresenca } from '../../../modules/registrospresencas/entities/RegistroPresenca'
import { Turma } from '../../../modules/turmas/entities/Turma'
import { UnidadeCurricular } from '../../../modules/unidadescurriculares/entities/UnidadeCurricular'

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),

  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    rejectUnauthorized: false,
  },

  synchronize: false,
  logging: false,

  entities: [
    Aluno,
    Aula,
    Dispositivo,
    InscricaoTurma,
    LogAcesso,
    Professor,
    RegistroPresenca,
    Turma,
    UnidadeCurricular,
  ],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
})
