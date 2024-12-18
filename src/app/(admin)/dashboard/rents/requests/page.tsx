import { RentService } from "@/services/rent.service";
import RentDataTable from "./data-table";
import { filterRentsParamsSchema } from "@/schemas/filterParams.schema";

const rentService = new RentService();

const RentRequestPage = async (
  props: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
  }
) => {
  const searchParams = await props.searchParams;
  const queries = filterRentsParamsSchema.parse(searchParams);
  const rents = rentService.GetAll(queries);

  return <RentDataTable rentsPromise={rents} />;
};

export default RentRequestPage;
