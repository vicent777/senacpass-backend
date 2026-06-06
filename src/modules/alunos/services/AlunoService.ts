import { Aluno } from '../entities/Aluno';
import { IAlunoRepository } from '../repositories/IAlunoRepository';

export class AlunoService {
    constructor(private alunoRepository: IAlunoRepository) {}

    async listarTodos(): Promise<Aluno[]> {
        return this.alunoRepository.findAll();
    }

    async buscarPorId(id: string): Promise<Aluno | null> {
        const aluno = await this.alunoRepository.findById(id);
        if (!aluno) {
            throw new Error('Aluno não encontrado');
        }
        return aluno;
    }

    async criarAluno(data: Partial<Aluno>): Promise<Aluno> {
        //Garante que os campos cruciais foram enviados
        if (!data.matricula_institucional || !data.email) {
            throw new Error('Matrícula institucional e Email são campos obrigatórios.');
        }

        // Agora não precisa usar o "!" porque já garantimos que eles existem acima
        const alunoExistente = await this.alunoRepository.findByMatricula(data.matricula_institucional);
        if (alunoExistente) {
            throw new Error('Matrícula institucional já existe');
        }

        const emailExistente = await this.alunoRepository.findByEmail(data.email);
        if (emailExistente) {
            throw new Error('Email já existe');
        }

        return this.alunoRepository.create(data);
    }

    async atualizarAluno(id: string, data: Partial<Aluno>): Promise<Aluno> {
        const aluno = await this.alunoRepository.findById(id);
        if (!aluno) {
            throw new Error('Aluno não encontrado');
        }

        // Se o usuário estiver tentando mudar o e-mail, checa se o novo e-mail já pertence a OUTRO aluno
        if (data.email && data.email !== aluno.email) {
            const emailDuplicado = await this.alunoRepository.findByEmail(data.email);
            if (emailDuplicado) {
                throw new Error('Este email já está sendo utilizado por outro aluno.');
            }
        }

        // Se o usuário estiver tentando mudar a matrícula, checa se a nova matrícula já pertence a OUTRO aluno
        if (data.matricula_institucional && data.matricula_institucional !== aluno.matricula_institucional) {
            const matriculaDuplicada = await this.alunoRepository.findByMatricula(data.matricula_institucional);
            if (matriculaDuplicada) {
                throw new Error('Esta matrícula já está sendo utilizada por outro aluno.');
            }
        }

        Object.assign(aluno, data);
        return this.alunoRepository.save(aluno);
    }

    async deletarAluno(id: string): Promise<void> {
        // O buscarPorId já joga o erro se não achar, poupando código
        await this.buscarPorId(id);
        await this.alunoRepository.delete(id);
    }
}