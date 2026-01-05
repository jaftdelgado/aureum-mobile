import type {
  MarketRepository,
  MarketStreamHandlers,
  TradeParams,
} from "@domain/repositories/MarketRepository";
import type { MarketSnapshotDTO, TradeResultDTO } from "./market.dto";
import { mapSnapshot, mapTradeResult } from "./market.mappers";
import { MarketGrpcClient } from "@infra/api/http/marketGrpcClient";

export class MarketApiRepository implements MarketRepository {
  private client: MarketGrpcClient;

  constructor(client = new MarketGrpcClient()) {
    this.client = client;
  }

  subscribeToMarket(courseId: string, handlers: MarketStreamHandlers): () => void {
    return this.client.streamMarket<MarketSnapshotDTO>(courseId, {
      onMessage: (dto) => handlers.onData(mapSnapshot(dto)),
      onError: handlers.onError,
      onComplete: handlers.onComplete,
    });
  }

  async buyAsset(params: TradeParams) {
    const body = {
        teamPublicId: params.teamPublicId,
        assetPublicId: params.assetPublicId,
        userPublicId: params.userPublicId,
        quantity: params.quantity,
        price: params.price,
    };


    const dto = (await this.client.buy(body)) as TradeResultDTO;
    return mapTradeResult(dto);
  }

  async sellAsset(params: TradeParams) {
    const body = {
        teamPublicId: params.teamPublicId,
        assetPublicId: params.assetPublicId,
        userPublicId: params.userPublicId,
        quantity: params.quantity,
        price: params.price,
    };


    const dto = (await this.client.sell(body)) as TradeResultDTO;
    return mapTradeResult(dto);
  }
}
