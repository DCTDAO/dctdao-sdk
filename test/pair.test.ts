import { ChainId, Token, Pair, TokenAmount, WRAPPED, Price } from '../src'

describe('Pair', () => {
  const DCA = new Token(ChainId.MOONBEAM_TEST, '0x67B5656d60a809915323Bf2C40A8bEF15A152e3e', 18, 'DCA', 'DCA Token')
  const DCB = new Token(ChainId.MOONBEAM_TEST, '0x9b1f7F645351AF3631a656421eD2e40f2802E6c0', 18, 'DCB', 'DCB Token')
  
  const DCA_B = new Token(ChainId.BINANCE_TEST, '0x3Cc7B9a386410858B412B00B13264654F68364Ed', 18, 'DCA', 'DCA Token')
  const DCB_B = new Token(ChainId.BINANCE_TEST, '0xAe5057BB185fC820219e21bC7382c0DE7A42fE86', 18, 'DCB', 'DCB Token')

  const DCA_R = new Token(ChainId.ROPSTEN, '0xB4B6D45d4706BBd93bb0e14e517B81453db0468C', 18, 'DCA', 'DCA Token')
  const DCB_R = new Token(ChainId.ROPSTEN, '0x2fE357d6F828777c36209973227a75cB8afe7626', 18, 'DCB', 'DCB Token')

  const DCA_O = new Token(ChainId.ROPSTEN, '0x9b1f7F645351AF3631a656421eD2e40f2802E6c0', 18, 'DCA', 'DCA Token')
  const DCB_O = new Token(ChainId.ROPSTEN, '0x67B5656d60a809915323Bf2C40A8bEF15A152e3e', 18, 'DCB', 'DCB Token')


  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(() => new Pair(new TokenAmount(DCA, '100'), new TokenAmount(WRAPPED[ChainId.MAINNET], '100'))).toThrow(
        'CHAIN_IDS'
      )
    })
  })
  
  describe('#getAddress', () => {
    it('returns the correct address', () => {
      expect(Pair.getAddress(DCA, DCB)).toEqual('0x09EC2cD6E784fAff4457f85C7Abf3097FA318B86')
      expect(Pair.getAddress(DCA_B, DCB_B)).toEqual('0x6a6Ab599ceA8979dda3c18B27767FA88C56fbeAa')
      expect(Pair.getAddress(DCA_R, DCB_R)).toEqual('0x8297d5Fb258a00f0B642CB7dc09F0F4dC0DbDe4f')
      expect(Pair.getAddress(DCA_O, DCB_O)).toEqual('0x09EC2cD6E784fAff4457f85C7Abf3097FA318B86')
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(new Pair(new TokenAmount(DCA, '100'), new TokenAmount(DCB, '100')).token0).toEqual(DCA)
      expect(new Pair(new TokenAmount(DCB, '100'), new TokenAmount(DCA, '100')).token0).toEqual(DCA)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(new Pair(new TokenAmount(DCA, '100'), new TokenAmount(DCB, '100')).token1).toEqual(DCB)
      expect(new Pair(new TokenAmount(DCB, '100'), new TokenAmount(DCA, '100')).token1).toEqual(DCB)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(new Pair(new TokenAmount(DCB, '100'), new TokenAmount(DCA, '101')).reserve0).toEqual(
        new TokenAmount(DCA, '101')
      )
      expect(new Pair(new TokenAmount(DCA, '101'), new TokenAmount(DCB, '100')).reserve0).toEqual(
        new TokenAmount(DCA, '101')
      )
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(new Pair(new TokenAmount(DCB, '100'), new TokenAmount(DCA, '101')).reserve1).toEqual(
        new TokenAmount(DCB, '100')
      )
      expect(new Pair(new TokenAmount(DCA, '101'), new TokenAmount(DCB, '100')).reserve1).toEqual(
        new TokenAmount(DCB, '100')
      )
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(new Pair(new TokenAmount(DCB, '101'), new TokenAmount(DCA, '100')).token0Price).toEqual(
        new Price(DCA, DCB, '100', '101')
      )
      expect(new Pair(new TokenAmount(DCA, '100'), new TokenAmount(DCB, '101')).token0Price).toEqual(
        new Price(DCA, DCB, '100', '101')
      )
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(new Pair(new TokenAmount(DCB, '101'), new TokenAmount(DCA, '100')).token1Price).toEqual(
        new Price(DCB, DCA, '101', '100')
      )
      expect(new Pair(new TokenAmount(DCA, '100'), new TokenAmount(DCB, '101')).token1Price).toEqual(
        new Price(DCB, DCA, '101', '100')
      )
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(new TokenAmount(DCB, '101'), new TokenAmount(DCA, '100'))
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(DCA)).toEqual(pair.token0Price)
      expect(pair.priceOf(DCB)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WRAPPED[ChainId.MOONBEAM_TEST])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(new Pair(new TokenAmount(DCB, '100'), new TokenAmount(DCA, '101')).reserveOf(DCB)).toEqual(
        new TokenAmount(DCB, '100')
      )
      expect(new Pair(new TokenAmount(DCA, '101'), new TokenAmount(DCB, '100')).reserveOf(DCB)).toEqual(
        new TokenAmount(DCB, '100')
      )
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(new TokenAmount(DCA, '101'), new TokenAmount(DCB, '100')).reserveOf(WRAPPED[ChainId.MOONBEAM_TEST])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(new Pair(new TokenAmount(DCB, '100'), new TokenAmount(DCA, '100')).chainId).toEqual(ChainId.MOONBEAM_TEST)
      expect(new Pair(new TokenAmount(DCA, '100'), new TokenAmount(DCB, '100')).chainId).toEqual(ChainId.MOONBEAM_TEST)
    })
  })
  describe('#involvesToken', () => {
    expect(new Pair(new TokenAmount(DCB, '100'), new TokenAmount(DCA, '100')).involvesToken(DCB)).toEqual(true)
    expect(new Pair(new TokenAmount(DCB, '100'), new TokenAmount(DCA, '100')).involvesToken(DCA)).toEqual(true)
    expect(
      new Pair(new TokenAmount(DCB, '100'), new TokenAmount(DCA, '100')).involvesToken(WRAPPED[ChainId.MOONBEAM_TEST])
    ).toEqual(false)
  })

})
