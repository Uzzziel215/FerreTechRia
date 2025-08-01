package com.ferreteria.service;

import com.ferreteria.model.Cliente;
import com.ferreteria.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public List<Cliente> obtenerTodosLosClientes() {
        return clienteRepository.findAll();
    }

    public Optional<Cliente> obtenerClientePorId(Long id) {
        return clienteRepository.findById(id);
    }

    public Cliente guardarCliente(Cliente cliente) {
        validarCliente(cliente);
        return clienteRepository.save(cliente);
    }

    public Cliente actualizarCliente(Long id, Cliente cliente) {
        Optional<Cliente> clienteExistente = clienteRepository.findById(id);
        if (clienteExistente.isPresent()) {
            cliente.setId(id);
            validarCliente(cliente);
            return clienteRepository.save(cliente);
        }
        throw new RuntimeException("Cliente no encontrado con ID: " + id);
    }

    public void eliminarCliente(Long id) {
        if (clienteRepository.findById(id).isPresent()) {
            clienteRepository.deleteById(id);
        } else {
            throw new RuntimeException("Cliente no encontrado con ID: " + id);
        }
    }

    public List<Cliente> buscarClientes(String termino) {
        if (termino == null || termino.trim().isEmpty()) {
            return obtenerTodosLosClientes();
        }
        return clienteRepository.findByNombreContainingIgnoreCase(termino);
    }

    public List<Cliente> obtenerClientesConDescuento() {
        return clienteRepository.findClientesConDescuento();
    }

    public Optional<Cliente> buscarPorEmail(String email) {
        return clienteRepository.findByEmailAndActivoTrue(email);
    }

    private void validarCliente(Cliente cliente) {
        if (cliente.getNombre() == null || cliente.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del cliente es obligatorio");
        }
        if (cliente.getDescuento() != null && (cliente.getDescuento() < 0 || cliente.getDescuento() > 100)) {
            throw new IllegalArgumentException("El descuento debe estar entre 0 y 100%");
        }
        if (cliente.getEmail() != null && !cliente.getEmail().isEmpty() && !isValidEmail(cliente.getEmail())) {
            throw new IllegalArgumentException("El formato del email no es válido");
        }
    }

    private boolean isValidEmail(String email) {
        return email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
}
