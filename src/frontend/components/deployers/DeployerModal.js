import AmbireDeployer from './AmbireDeployer/AmbireDeployer'
import breakpoints from '../../breakpoints'
import CustomBytecode from './CustomBytecode'
import DeployerType from './DeployerType'
import GnosisSafeDeployer from './GnosisSafeDeployer/GnosisSafeDeployer'
import { MainContext } from '../../MainContext'
import Stack from '@mui/material/Stack'
import styled from '@emotion/styled'
import { useContext, useMemo } from 'react'

export default function DeployerModal({ isOpen, address, deployerType, onClose }) {
    const { contracts, network } = useContext(MainContext)
    const { registrar } = contracts || {}

    const [ DeployerComponent, deployer ] = useMemo(() => {
        const none = [() => <div></div>, {}]

        switch (deployerType) {
            case DeployerType.NONE: return none
            case DeployerType.CUSTOM_BYTECODE: return [CustomBytecode, {}]
            case DeployerType.GNOSIS_SAFE: return [GnosisSafeDeployer, contracts?.safeDeployer]
            case DeployerType.AMBIRE: return [AmbireDeployer, contracts?.ambireAccountDeployer]
            default: return none
        }
    }, [deployerType])

    return (
      <EditBytecodeModal open={isOpen}>
        {address && (
          <DeployerComponent 
            nftAddress={address}
            contracts={network.contracts} 
            deployer={deployer}
            registrar={registrar}
            network={network}
            onClose={onClose}
          />
        )}
      </EditBytecodeModal>
    )
}


const EditBytecodeModal = styled(Stack)(({ open }) => ({
    [`@media ${breakpoints.up.xs}`]: {
      width: '90%',
    },
    [`@media ${breakpoints.up.sm}`]: {
      width: '400px',
    },
    [`@media ${breakpoints.up.md}`]: {
      width: '600px',
    },
    borderRadius: '20px',
    background: 'rgba(39,25,76,0.85)',
    boxShadow: '2px 1px 7px 0px rgb(0, 0, 0, 0.5)',
    margin: 'auto',
    color: 'white',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'block',
    minHeight: 350,
    zIndex: open ? 100 : -1,
    opacity: open ? 1 : 0,
    transition: 'opacity 0.3s ease-out',
    padding: 20,
  }))