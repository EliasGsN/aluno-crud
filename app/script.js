class Aluno {
    constructor(nome, idade, curso, notaFinal) {
        this.nome = nome;
        this.idade = idade;
        this.curso = curso;
        this.notaFinal = notaFinal;
        this.id = Date.now().toString();
    }

    isAprovado = () => this.notaFinal >= 7;

    toString = () => {
        return `Aluno: ${this.nome} (${this.idade} anos) - Curso: ${this.curso}, Nota: ${this.notaFinal.toFixed(1)} [${this.isAprovado() ? 'Aprovado' : 'Reprovado'}]`;
    }
}

let alunos = [];
let editandoId = null;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formAluno');
    const btnCadastrar = document.getElementById('btnCadastrar');
    const btnCancelar = document.getElementById('btnCancelar');
    const corpoTabela = document.getElementById('corpoTabela');
    const totalAlunos = document.getElementById('total-alunos');

    // Eventos do formulário
    btnCadastrar.addEventListener('click', salvarAluno);
    btnCancelar.addEventListener('click', cancelarEdicao);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        salvarAluno();
    });

    // Eventos dos relatórios
    document.getElementById('btnAprovados').addEventListener('click', mostrarAprovados);
    document.getElementById('btnMediaNotas').addEventListener('click', calcularMediaNotas);
    document.getElementById('btnMediaIdades').addEventListener('click', calcularMediaIdades);
    document.getElementById('btnOrdemAlfabetica').addEventListener('click', listarPorOrdemAlfabetica);
    document.getElementById('btnAlunosPorCurso').addEventListener('click', mostrarQuantidadePorCurso);

    // Inicializar tabela
    atualizarTabela();
});

function salvarAluno() {
    const nome = document.getElementById('nome').value;
    const idade = parseInt(document.getElementById('idade').value);
    const curso = document.getElementById('curso').value;
    const notaFinal = parseFloat(document.getElementById('nota').value);
    const alunoId = document.getElementById('alunoId').value;

    if (nome && !isNaN(idade) && curso && !isNaN(notaFinal)) {
        if (alunoId) {
            const index = alunos.findIndex(a => a.id === alunoId);
            if (index !== -1) {
                alunos[index] = new Aluno(nome, idade, curso, notaFinal);
                alunos[index].id = alunoId;
                alert('Aluno atualizado com sucesso!');
            }
            editandoId = null;
            document.getElementById('btnCadastrar').textContent = 'Cadastrar';
            document.getElementById('btnCancelar').style.display = 'none';
        } else {
            const novoAluno = new Aluno(nome, idade, curso, notaFinal);
            alunos.push(novoAluno);
            alert('Aluno cadastrado com sucesso!');
        }

        atualizarTabela();
        form.reset();
        document.getElementById('alunoId').value = '';
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

function cancelarEdicao() {
    document.getElementById('formAluno').reset();
    document.getElementById('alunoId').value = '';
    document.getElementById('btnCadastrar').textContent = 'Cadastrar';
    document.getElementById('btnCancelar').style.display = 'none';
    editandoId = null;
}

function editarAluno(id) {
    const aluno = alunos.find(a => a.id === id);
    if (aluno) {
        document.getElementById('alunoId').value = aluno.id;
        document.getElementById('nome').value = aluno.nome;
        document.getElementById('idade').value = aluno.idade;
        document.getElementById('curso').value = aluno.curso;
        document.getElementById('nota').value = aluno.notaFinal;
        
        document.getElementById('btnCadastrar').textContent = 'Atualizar';
        document.getElementById('btnCancelar').style.display = 'inline-block';
        editandoId = id;
    }
}

function excluirAluno(id) {
    const aluno = alunos.find(a => a.id === id);
    if (aluno && confirm(`Tem certeza que deseja excluir o aluno ${aluno.nome}?`)) {
        alunos = alunos.filter(a => a.id !== id);
        atualizarTabela();
        
        if (editandoId === id) {
            cancelarEdicao();
        }
        alert('Aluno excluído com sucesso!');
    }
}

function atualizarTabela() {
    const corpoTabela = document.getElementById('corpoTabela');
    corpoTabela.innerHTML = '';
    
    alunos.forEach(aluno => {
        const tr = document.createElement('tr');
        
        if (aluno.isAprovado()) {
            tr.classList.add('aprovado');
        } else {
            tr.classList.add('reprovado');
        }
        
        tr.innerHTML = `
            <td>${aluno.nome}</td>
            <td>${aluno.idade}</td>
            <td>${aluno.curso}</td>
            <td>${aluno.notaFinal.toFixed(1)}</td>
            <td class="acoes">
                <button class="editar">Editar</button>
                <button class="excluir">Excluir</button>
                <span class="status">${aluno.isAprovado() ? '✅ Aprovado' : '❌ Reprovado'}</span>
            </td>
        `;
        
        tr.querySelector('.editar').addEventListener('click', () => editarAluno(aluno.id));
        tr.querySelector('.excluir').addEventListener('click', () => excluirAluno(aluno.id));
        
        corpoTabela.appendChild(tr);
    });
    
    document.getElementById('total-alunos').textContent = `Total de alunos: ${alunos.length}`;
}

// Funções de relatório
function mostrarAprovados() {
    const aprovados = alunos.filter(aluno => aluno.isAprovado());
    const lista = aprovados.map(aluno => `- ${aluno.nome}: ${aluno.notaFinal.toFixed(1)}`).join('\n');
    alert(aprovados.length > 0 ? `Alunos Aprovados:\n${lista}` : 'Nenhum aluno aprovado encontrado!');
}

function calcularMediaNotas() {
    if (alunos.length === 0) {
        alert('Nenhum aluno cadastrado para calcular média!');
        return;
    }
    const total = alunos.reduce((sum, aluno) => sum + aluno.notaFinal, 0);
    alert(`Média das notas: ${(total / alunos.length).toFixed(2)}`);
}

function calcularMediaIdades() {
    if (alunos.length === 0) {
        alert('Nenhum aluno cadastrado para calcular média!');
        return;
    }
    const total = alunos.reduce((sum, aluno) => sum + aluno.idade, 0);
    alert(`Média das idades: ${(total / alunos.length).toFixed(1)} anos`);
}

function listarPorOrdemAlfabetica() {
    if (alunos.length === 0) {
        alert('Nenhum aluno cadastrado para ordenar!');
        return;
    }
    const lista = [...alunos].sort((a, b) => a.nome.localeCompare(b.nome))
                            .map(aluno => `- ${aluno.nome}`)
                            .join('\n');
    alert(`Alunos em ordem alfabética:\n${lista}`);
}

function mostrarQuantidadePorCurso() {
    if (alunos.length === 0) {
        alert('Nenhum aluno cadastrado para analisar!');
        return;
    }
    const cursos = {};
    alunos.forEach(aluno => {
        cursos[aluno.curso] = (cursos[aluno.curso] || 0) + 1;
    });
    const relatorio = Object.entries(cursos)
                          .map(([curso, qtd]) => `- ${curso}: ${qtd} aluno(s)`)
                          .join('\n');
    alert(`Quantidade de alunos por curso:\n${relatorio}`);
}