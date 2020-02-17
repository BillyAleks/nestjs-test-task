import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  NotFoundException,
  BadRequestException
} from "@nestjs/common";
import { ManufacturerService } from "./manufacturer.service";
import { CreateManufacturerDto } from "./interfaces/dto/createManufacturer.dto";
import { UpdateManufacturerDto } from "./interfaces/dto/updateManufacturer.dto";
import { Manufacturer } from "./entities/manufacturer.entity";
import { ApiTags, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiCreatedResponse } from "@nestjs/swagger";

@ApiTags('manufacturers')
@Controller("manufacturers")
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Get()
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async findAll(): Promise<Manufacturer[]> {
    try {
      const manufacturers = await this.manufacturerService.findAll();
      return manufacturers;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(":id")
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async findOne(@Param("id") id: string): Promise<Manufacturer> {
    try {
      const manufacturer = await this.manufacturerService.findOne(id);
      return manufacturer;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @HttpCode(201)
  async create(
    @Body() createManufacturerDto: CreateManufacturerDto
  ): Promise<void> {
    try {
      await this.manufacturerService.create(createManufacturerDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(":id")
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @HttpCode(201)
  async put(
    @Param("id") id: string,
    @Body() putManufacturerDto: CreateManufacturerDto
  ): Promise<void> {
    try {
      await this.manufacturerService.put(id, putManufacturerDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(":id")
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @HttpCode(201)
  async update(
    @Param("id") id: string,
    @Body() updateManufacturerDto: UpdateManufacturerDto
  ): Promise<void> {
    try {
      await this.manufacturerService.update(id, updateManufacturerDto);
    } catch (error) {
      if (error.message.includes("404")) {
        throw new NotFoundException(error.message);
      } else throw new BadRequestException(error.message);
    }
  }

  @Delete(":id")
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async delete(@Param("id") id: string): Promise<void> {
    try {
      await this.manufacturerService.delete(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
