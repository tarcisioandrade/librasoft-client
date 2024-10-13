<div align="center">
  <img src="https://github.com/user-attachments/assets/c739a20e-f0e4-4eb3-9123-094497fff1b7" />
	<p>LibraSoft é um sistema bibliotecário que proporciona aos usuários acesso online ao acervo de livros, bem como a realização de solicitações de empréstimo e o gerenciamento através de um dashboard disponivel para usuários administradores.</p>
    <a href="https://librasoft.vercel.app/?pageNumber=1" target="_blank">
	    <img src="https://deploy-badge.vercel.app/vercel/librasoft" alt="Vercel Deploy"/>
	</a>
	<a href="https://github.com/tarcisioandrade/librasoft-client/stargazers" target="_blank">
	    <img src="https://img.shields.io/github/stars/tarcisioandrade/librasoft-client?logo=github&label=Stars" alt="Stars"/>
	</a>
</div>
<hr/>

> [!NOTE]
> Este sistema funciona como o cliente/frontend que interage com a API REST desenvolvida em .NET Core 8. Para obter informações mais detalhadas, consulte o [repositório](https://github.com/tarcisioandrade/LibraSoft) da API.

# Tecnologias Utilizadas

- **[TypeScript](https://www.typescriptlang.org/)**: Linguagem de programação fortemente tipada que se baseia no JavaScript.
- [**Next.js (App Router)**](https://nextjs.org/): Utilizado para gerenciamento de rotas com a nova abordagem de roteamento do Next.js.
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework CSS utilitário para um design rápido e responsivo.
- **[Shadcn/UI](https://ui.shadcn.com)**: Biblioteca de componentes acessíveis e personalizados para melhorar a interface do usuário.
- **[Zod](https://zod.dev/)**: Biblioteca para validação de esquemas e tipos TypeScript de forma simples e eficiente.
- **[React Hook Form](https://react-hook-form.com/)**: Gerenciamento de formulários no React com foco em desempenho e facilidade de uso.
- [**Better Fetch**](https://better-fetch.vercel.app/):  Fetch wrapper com compatibilidade ao cacheamento do next e schemas do zod.
<!--
- **[Playwright](https://playwright.dev/)**: Ferramenta de automação para testes end-to-end, garantindo a qualidade do front-end.
- **[Vitest](https://vitest.dev/)**: Framework de testes unitários rápido e moderno, integrado com o ambiente de desenvolvimento Vite.
-->

# Abordagem

### Rotas Privadas

A verificação do acesso a rotas por usuários não autenticados foi implementada por meio de um middleware. Nesse processo, verificamos se existe uma sessão armazenada nos cookies que é salva com a diretiva httpOnly e se o token de acesso ainda é válido. Essa abordagem garante a segurança e a restrição adequada de acesso às rotas privadas da aplicação.

### Cache e Keys

Para reduzir requisições desnecessárias e evitar sobrecarga no servidor, algumas rotas foram configuradas para aproveitar o recurso de cache oferecido pelo Next.js. Com o objetivo de facilitar futuras alterações, as chaves usadas para identificar as tags das requisições em cache foram centralizadas na classe `CacheKeys`.

```ts
export class CacheKeys {
  static Review = {
    Get: "get-review",
    GetAll: "get-all-review",
  };
  static Bag = {
    GetAll: "get-all-bag",
  };
  static Book = {
    GetAll: "get-all-book",
  };
  static User = { Get: "get-user" };
  static Rent = { GetAll: "get-all-rent" };
  static Punishment = { GetAll: "get-all-punishment" };
}
```

### Services & Requests

A aplicação possui requisições de diversos tipos, user, books, author, etc. Todas elas estão no diretório `src/services` separadas por entidade. Todas as requisições são feitas utilizando a biblioteca **better fetch** que possui compatibilidade com o fetch do next e schemas do zod.

### Error Handling

Para o gerenciamento de erros, adotei o padrão Result, implementado em `utils/result.ts`. Essa abordagem permite uma manipulação mais segura e expressiva de possíveis falhas, tornando o código mais robusto e fácil de entender. Ao encapsular o resultado de uma operação e um possível erro em uma única estrutura de dados.

```ts
async ChangePassword(input: ChangePasswordInput) {
    const { error } = await fetchWithCredentials(this.endpoint + "/change-password", {
      method: "PATCH",
      body: input,
    });
    if (error) {
      return Err({ message: error.errors });
    }
    return Ok({ message: "Sua senha foi atualizada com sucesso!" });
  }
```

### Forms & Server Actions

Os formulários são gerenciados por meio da biblioteca React Hook Form e validados utilizando o Zod antes de serem submetidos a uma server action. Todas as actions estão agrupadas no diretório `src/actions`. Uma vez submetidos, os dados são enviados para uma requisição, que, em caso de sucesso, pode resultar na invalidação do cache ou no redirecionamento do usuário, conforme necessário.

### Perfomance

#### Memoization

Com o intuito de aprimorar a performance da aplicação, foram adotadas estratégias de memorização para evitar execuções desnecessárias a cada rerender.

```ts
const categoriesOptions: Option[] = useMemo(
    () =>
      categories.map((categ) => ({
        label: categ.title,
        value: categ.title,
      })),
    [],
  );
```

Essa abordagem é comumente utilizada na aplicação, conforme demonstrado no exemplo acima, que emprega a função map para gerar um array com uma estrutura específica. Envolvelo com o useMemo garante que esse cálculo seja realizado apenas uma vez, melhorando assim a eficiência do processo.

#### Dynamic Imports

Para melhorar o desempenho do carregamento inicial da aplicação, foi usado importações dinâmicas que divide ó código em partes menores que podem ser carregadas conforme necessário, reduzindo a quantidade de código que precisa ser analisada e executada quando um usuário visita a página pela primeira vez.

```ts
const FormRentDynamic = dynamic(() => import("./components/form-rent"));

export const ...

<FormRentDynamic book={book.data} />
```

## Créditos

**Design "Inspirado" 😅**

- [Amazon](https://www.amazon.com.br/) 
- [Estante Virtual](https://www.estantevirtual.com.br/)
