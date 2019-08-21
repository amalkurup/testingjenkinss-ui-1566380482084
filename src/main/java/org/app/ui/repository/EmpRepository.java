package org.app.ui.repository;

import org.app.ui.domain.Emp;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Emp entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmpRepository extends JpaRepository<Emp, Long> {

}
