package com.hris.HRIS.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hris.HRIS.model.*;
import com.hris.HRIS.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SystemAutomateService {

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    ExitListRepository exitListRepository;

    @Autowired
    OrganizationRepository organizationRepository;

    @Autowired
    DepartmentRepository departmentRepository;

    @Autowired
    ChannelRepository channelRepository;

    @Autowired
    EmailService emailService;

    public void UpdateEmployeeJobDataExit(ExitListModel exitListModel) {
        Optional<EmployeeModel> employee =  employeeRepository.findOneByEmail(exitListModel.getEmail());

        if (employee.isPresent()) {
            EmployeeModel existingEmployee = employee.get();
            existingEmployee.setJobData(exitListModel.getJobData());
            employeeRepository.save(existingEmployee);
        }
    }

    public void UpdateEmployeeJobDataPromotion(PromotionModel promotionModel){
        Optional<EmployeeModel> employee =  employeeRepository.findOneByEmail(promotionModel.getEmail());

        if (employee.isPresent()) {
            EmployeeModel existingEmployee = employee.get();
            existingEmployee.setJobData(promotionModel.getJobData());
            employeeRepository.save(existingEmployee);
        }
    }

    public void UpdateEmployeeJobDataTransfer(TransferModel transferModel){
        Optional<EmployeeModel> employee =  employeeRepository.findOneByEmail(transferModel.getEmail());

        if (employee.isPresent()) {
            EmployeeModel existingEmployee = employee.get();
            existingEmployee.setJobData(transferModel.getJobData());
            employeeRepository.save(existingEmployee);
        }
    }

    public Float CalculateGratuity(ExitListModel exitListModel) {
        String date1 = exitListModel.getDoj();
        String date2 = exitListModel.getDoe();

        LocalDate localDate1 = LocalDate.parse(date1);
        LocalDate localDate2 = LocalDate.parse(date2);

        Period period = Period.between(localDate1, localDate2);
        int years = period.getYears();

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jobDataMap = objectMapper.convertValue(exitListModel.getJobData(), Map.class);
        Object salaryObject = jobDataMap.get("salary");

        float baseSalary = Float.parseFloat(salaryObject.toString());

//        Gratuity Formula: Gratuity (G) = n*b*15/26

        return years * baseSalary * 15 / 26;
    }

    public void addExitList(EmployeeExitModel employeeExitModel) {
        ExitListModel exitListModel = new ExitListModel();

        exitListModel.setName(employeeExitModel.getName());
        exitListModel.setEmail(employeeExitModel.getEmail());
        exitListModel.setPhone(employeeExitModel.getPhone());
        exitListModel.setAddress(employeeExitModel.getAddress());
        exitListModel.setJobData(employeeExitModel.getJobData());
        exitListModel.setDoe(employeeExitModel.getDoe());
        exitListModel.setDoj(employeeExitModel.getDoj());
        exitListModel.setPhoto(employeeExitModel.getPhoto());
        exitListRepository.save(exitListModel);

        emailService.sendSimpleEmail(employeeExitModel.getEmail(), "Employee Exit", "Your exit request has been approved");
    }

    public void updateOrganizationDepartments(DepartmentModel departmentModel){
        Optional<OrganizationModel> organization =  organizationRepository.findById(departmentModel.getOrganizationId());

        if (organization.isPresent()) {
            OrganizationModel existingOrganization = organization.get();
            // Check if departments list is null, and initialize it if necessary
            if (existingOrganization.getDepartments() == null) {
                existingOrganization.setDepartments(new ArrayList<>());
            }

            // Add the new department to the list
            existingOrganization.getDepartments().add(departmentModel);

            organizationRepository.save(existingOrganization);
        }
    }

    public void updateOrganizationEmployees(EmployeeModel employeeModel){
        Optional<OrganizationModel> organization =  organizationRepository.findById(employeeModel.getOrganizationId());

        if (organization.isPresent()) {
            OrganizationModel existingOrganization = organization.get();
            // Check if employees list is null, and initialize it if necessary
            if (existingOrganization.getEmployees() == null) {
                existingOrganization.setEmployees(new ArrayList<>());
            }

            // Add the new employee to the list
            existingOrganization.getEmployees().add(employeeModel);

            organizationRepository.save(existingOrganization);
        }
    }

    public void deleteDepartmentAndUpdateOrganization(String departmentId) {
        Optional<DepartmentModel> departmentOptional = departmentRepository.findById(departmentId);

        if (departmentOptional.isPresent()) {
            DepartmentModel departmentToDelete = departmentOptional.get();
            String organizationId = departmentToDelete.getOrganizationId();

            // Delete the department
            departmentRepository.deleteById(departmentId);

            // Update the organization
            Optional<OrganizationModel> organizationOptional = organizationRepository.findById(organizationId);

            if (organizationOptional.isPresent()) {
                OrganizationModel existingOrganization = organizationOptional.get();

                // Check if departments list is null, and initialize it if necessary
                if (existingOrganization.getDepartments() == null) {
                    existingOrganization.setDepartments(new ArrayList<>());
                } else {
                    // Remove the deleted department from the list
                    existingOrganization.getDepartments().removeIf(d -> d.getId().equals(departmentId));
                }

                organizationRepository.save(existingOrganization);
            }
        }
    }

    public void deleteEmployeeAndUpdateOrganization(String employeeId) {
        Optional<EmployeeModel> employeeOptional = employeeRepository.findById(employeeId);

        if (employeeOptional.isPresent()) {
            EmployeeModel employeeToDelete = employeeOptional.get();
            String organizationId = employeeToDelete.getOrganizationId();

            // Delete the employee
            employeeRepository.deleteById(employeeId);

            // Update the organization
            Optional<OrganizationModel> organizationOptional = organizationRepository.findById(organizationId);

            if (organizationOptional.isPresent()) {
                OrganizationModel existingOrganization = organizationOptional.get();

                // Check if employees list is null, and initialize it if necessary
                if (existingOrganization.getEmployees() == null) {
                    existingOrganization.setEmployees(new ArrayList<>());
                } else {
                    // Remove the deleted employee from the list
                    existingOrganization.getEmployees().removeIf(e -> e.getId().equals(employeeId));
                }

                organizationRepository.save(existingOrganization);
            }
        }
    }

    public void deleteEmployeeAndUpdateOrganizationByEmail(String employeeEmail) {
        Optional<EmployeeModel> employeeOptional = employeeRepository.findOneByEmail(employeeEmail);

        if (employeeOptional.isPresent()) {
            EmployeeModel employeeToDelete = employeeOptional.get();
            String organizationId = employeeToDelete.getOrganizationId();

            // Delete the employee
            employeeRepository.deleteById(employeeToDelete.getId());

            // Update the organization
            Optional<OrganizationModel> organizationOptional = organizationRepository.findById(organizationId);

            if (organizationOptional.isPresent()) {
                OrganizationModel existingOrganization = organizationOptional.get();

                // Check if employees list is null, and initialize it if necessary
                if (existingOrganization.getEmployees() == null) {
                    existingOrganization.setEmployees(new ArrayList<>());
                } else {
                    // Remove the deleted employee from the list
                    existingOrganization.getEmployees().removeIf(e -> e.getEmail().equals(employeeEmail));
                }

                organizationRepository.save(existingOrganization);
            }
        }
    }

    public void updateDepartmentAndUpdateOrganization(String id, DepartmentModel updatedDepartment) {
        Optional<DepartmentModel> existingDepartmentOptional = departmentRepository.findById(id);

        if (existingDepartmentOptional.isPresent()) {
            DepartmentModel existingDepartment = existingDepartmentOptional.get();
            String organizationId = existingDepartment.getOrganizationId();

            // Update the department
            existingDepartment.setName(updatedDepartment.getName());
            existingDepartment.setDescription(updatedDepartment.getDescription());

            departmentRepository.save(existingDepartment);

            // Update the organization
            Optional<OrganizationModel> organizationOptional = organizationRepository.findById(organizationId);

            if (organizationOptional.isPresent()) {
                OrganizationModel existingOrganization = organizationOptional.get();

                // Check if departments list is null, and initialize it if necessary
                if (existingOrganization.getDepartments() == null) {
                    existingOrganization.setDepartments(new ArrayList<>());
                } else {
                    // Find and replace the existing department with the updated one
                    existingOrganization.getDepartments()
                            .replaceAll(d -> d.getId().equals(updatedDepartment.getId()) ? updatedDepartment : d);
                }

                organizationRepository.save(existingOrganization);
            }
        }
    }

    public void updateEmployeeAndUpdateOrganization(String id, EmployeeModel updatedEmployee) {
        Optional<EmployeeModel> existingEmployeeOptional = employeeRepository.findById(id);

        if (existingEmployeeOptional.isPresent()) {
            EmployeeModel existingEmployee = existingEmployeeOptional.get();
            String organizationId = existingEmployee.getOrganizationId();

            // Update the employee
            existingEmployee.setName(updatedEmployee.getName());
            existingEmployee.setEmail(updatedEmployee.getEmail());
            existingEmployee.setPhone(updatedEmployee.getPhone());
            existingEmployee.setAddress(updatedEmployee.getAddress());
            existingEmployee.setJobData(updatedEmployee.getJobData());
            existingEmployee.setDepartmentId(updatedEmployee.getDepartmentId());
            existingEmployee.setChannels(updatedEmployee.getChannels());
            existingEmployee.setDob(updatedEmployee.getDob());
            existingEmployee.setNic(updatedEmployee.getNic());
            existingEmployee.setGender(updatedEmployee.getGender());
            existingEmployee.setPhoto(updatedEmployee.getPhoto());
            existingEmployee.setStatus(updatedEmployee.getStatus());

            employeeRepository.save(existingEmployee);

            // Update the organization
            Optional<OrganizationModel> organizationOptional = organizationRepository.findById(organizationId);

            if (organizationOptional.isPresent()) {
                OrganizationModel existingOrganization = organizationOptional.get();

                // Check if employees list is null, and initialize it if necessary
                if (existingOrganization.getEmployees() == null) {
                    existingOrganization.setEmployees(new ArrayList<>());
                } else {
                    // Find and replace the existing employee with the updated one
                    existingOrganization.getEmployees()
                            .replaceAll(e -> e.getId().equals(updatedEmployee.getId()) ? updatedEmployee : e);
                }
            }
        }
    }

    public void updateEmployeeAndUpdateOrganizationByEmail(String email, EmployeeModel updatedEmployee) {
        Optional<EmployeeModel> existingEmployeeOptional = employeeRepository.findOneByEmail(email);

        if (existingEmployeeOptional.isPresent()) {
            EmployeeModel existingEmployee = existingEmployeeOptional.get();
            String organizationId = existingEmployee.getOrganizationId();

            // Update the employee
            existingEmployee.setName(updatedEmployee.getName());
            existingEmployee.setEmail(updatedEmployee.getEmail());
            existingEmployee.setPhone(updatedEmployee.getPhone());
            existingEmployee.setAddress(updatedEmployee.getAddress());
            existingEmployee.setJobData(updatedEmployee.getJobData());
            existingEmployee.setDepartmentId(updatedEmployee.getDepartmentId());
            existingEmployee.setChannels(updatedEmployee.getChannels());
            existingEmployee.setDob(updatedEmployee.getDob());
            existingEmployee.setNic(updatedEmployee.getNic());
            existingEmployee.setGender(updatedEmployee.getGender());
            existingEmployee.setPhoto(updatedEmployee.getPhoto());
            existingEmployee.setStatus(updatedEmployee.getStatus());

            employeeRepository.save(existingEmployee);

            // Update the organization
            Optional<OrganizationModel> organizationOptional = organizationRepository.findById(organizationId);

            if (organizationOptional.isPresent()) {
                OrganizationModel existingOrganization = organizationOptional.get();

                // Check if employees list is null, and initialize it if necessary
                if (existingOrganization.getEmployees() == null) {
                    existingOrganization.setEmployees(new ArrayList<>());
                } else {
                    // Find and replace the existing employee with the updated one
                    existingOrganization.getEmployees()
                            .replaceAll(e -> e.getEmail().equals(updatedEmployee.getEmail()) ? updatedEmployee : e);
                }
            }
        }
    }

    public void createDefaultChannels(DepartmentModel departmentModel){
        ChannelModel channelModel = new ChannelModel();
        channelModel.setDepartmentId(departmentModel.getId());
        channelModel.setName(departmentModel.getName() + "Official Channel");
        channelModel.setDescription("This is official channel for " + departmentModel.getName() + ". Please do not try to edit this channel.");
        channelModel.setPhoto("");

        channelRepository.save(channelModel);
    }

    public void deleteChannelsWhenDeleteDepartment(String departmentId){
        Optional<List<ChannelModel>> channelModel = channelRepository.findAllByDepartmentId(departmentId);

        channelModel.ifPresent(channelModels -> channelRepository.deleteAll(channelModels));
    }

    public void assignChannelsToEmployee(String employeeId) {
        Optional<EmployeeModel> employee = employeeRepository.findById(employeeId);
        if (employee.isPresent()) {
            EmployeeModel employeeModel = employee.get();

            Optional<List<ChannelModel>> channelModel = channelRepository.findAllByDepartmentId(employeeModel.getDepartmentId());

            employeeModel.setChannels(channelModel.get());

            employeeRepository.save(employeeModel);
        }
    }
}
