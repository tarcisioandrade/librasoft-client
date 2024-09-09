import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function LibraryRules() {
  return (
    <div className="mx-auto mt-8 w-full">
      <div className="mb-2 space-y-2">
        <h2 className="text-2xl font-bold">Termos e Condições de Utilização</h2>
        <p>Bem-vindo(a) à LibraSoft!</p>
        <p>
          Ao utilizar os serviços da nossa biblioteca, você concorda em cumprir os seguintes termos
          e condições:
        </p>
      </div>
      <Accordion type="single" className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Empréstimo de Materiais</AccordionTrigger>
          <AccordionContent className="text-base">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Prazo de Empréstimo:</strong> O prazo padrão de empréstimo é de 30 dias,
                podendo variar de acordo com o tipo de material.
              </li>
              <li>
                <strong>Devolução:</strong> Os materiais devem ser devolvidos na data prevista, em
                bom estado de conservação.
              </li>
              <li>
                <strong>Punição:</strong> A devolução de materiais após o prazo estipulado
                acarretará em uma punição de 1 mês ficando impossibilitado de solicitar novos
                aluguéis. Caso o usuário adquira 3 punições, a conta será banida permanentemente.
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Cuidados com os Materiais</AccordionTrigger>
          <AccordionContent className="text-base">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Conservação:</strong> Os usuários devem manusear os materiais com cuidado,
                evitando danos como rasuras, manchas, dobras ou rasgos.
              </li>
              <li>
                <strong>Higiene:</strong> É proibido consumir alimentos ou bebidas nas áreas de
                leitura.
              </li>
              <li>
                <strong>Empréstimo Interno:</strong> O empréstimo de materiais entre usuários é
                proibido.
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Acesso ao Acervo</AccordionTrigger>
          <AccordionContent className="text-base">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Consulta Local:</strong> Todos os materiais do acervo podem ser consultados
                nas dependências e aqui mesmo no site da biblioteca.
              </li>
              <li>
                <strong>Reserva [Em Breve]:</strong> É possível reservar materiais que estejam
                emprestados, garantindo assim a sua disponibilidade.
              </li>
              <li>
                <strong>Acesso a Bases de Dados:</strong> A biblioteca oferece acesso a diversas
                bases de dados online. O uso dessas ferramentas deve ser feito de acordo com as
                normas estabelecidas por cada base.
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Conduta do Usuário</AccordionTrigger>
          <AccordionContent className="text-base">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Respeito:</strong> O usuário deve respeitar os demais usuários e
                funcionários da biblioteca, mantendo o ambiente tranquilo e silencioso.
              </li>
              <li>
                <strong>Proibições:</strong> É proibido o uso de celulares com som, jogos
                eletrônicos e qualquer outro equipamento que possa perturbar os demais usuários.
              </li>
              <li>
                <strong>Danos:</strong> O usuário será responsabilizado por qualquer dano causado
                aos materiais da biblioteca.
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
