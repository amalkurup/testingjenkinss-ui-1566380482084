package org.app.ui.repository;

import org.app.ui.domain.Cust;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Cust entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CustRepository extends JpaRepository<Cust, Long> {

}
