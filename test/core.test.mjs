import { expect } from "chai"
import AddressFinder from "../src/core/AddressFinder.mjs"
import getAddressDifficulty from '../src/core/getAddressDifficulty.mjs'
import getDeployCode from '../src/core/getDeployCode.mjs'
import generateNFTAddress from '../src/core/generateNFTAddress.mjs'
  

describe('core', function() {

    describe('AddressFinder', function() {
        
        it("should return the right bytecode", async function () {
            
            const finder = new AddressFinder({
                factory: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
                owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
                difficulty: 7,
                onError: err => console.log('Error!: ', err),
                onSuccess: data => console.log('Success!: ', data),
                workerPath: './test/addressGeneratorWorker.cjs'
            })

            finder.start()
            await new Promise(res => setTimeout(res, 5000))
            
        })         
    
    })

    describe('getAddressDifficulty', () => {
        it('should be case insensitive', () => {
          expect(getAddressDifficulty('0x254dffcd32CcC0b1660F6d42EFbB754edaBAbC2B')).equal(3)
          expect(getAddressDifficulty('0x254dFFcd3277C0b1660F6d42EFbB754edaBAbC2B')).equal(2)
          expect(getAddressDifficulty('0x0000ffcd327770b1660F6d42EFbB754edaBAbC2B')).equal(4)
          expect(getAddressDifficulty('0x0000ffcd327770b1660FfFffEFbB774edaBAbC2B')).equal(5)
        })
      
        it('should return the correct value', () => {
          expect(getAddressDifficulty('0x0000ffcd3277dddddddddddfEFbB774edaBAbC2B')).equal(11)
          expect(getAddressDifficulty('0x000000000000000000e26cDfEFbB774edaBAbC2B')).equal(18)
          expect(getAddressDifficulty('0x0000000000000000000000000000000000000000')).equal(40)
          expect(getAddressDifficulty('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')).equal(40)
          expect(getAddressDifficulty('0x4111111111111111111111111111111111111111')).equal(39)
        })
    })

    describe("getDeployCode", function () {
    
        it("should return the right bytecode", function () {
            const deployBytecode = getDeployCode('0x0123456789ABCDEF0123456789ABCDEF01234567', '0x0123456789ABCDEF0123456789ABCDEF01234567')

            expect(deployBytecode).equal('0x730123456789ABCDEF0123456789ABCDEF0123456767363d3d37363d34f03d5260086018f3')
        })

    }) 

    describe("generateNFTAddress", function () {
    
        it("should return the right address", function () {
            const FACTORY_ADDRESS = '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550'
            const OWNER_ADDRESS = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
            const SALT = '0x000000000000000000000000000000000000000000000000000000000000007B'
        
            const address = generateNFTAddress(FACTORY_ADDRESS, OWNER_ADDRESS, SALT)
        
            expect(address).equal('0x309663a0ca6d28208Bd78f85952b7952b8bBBb6B')
        })

    })     

})